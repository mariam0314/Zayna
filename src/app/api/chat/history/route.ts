// models/Chat.ts
import mongoose from 'mongoose';

export interface IChatMessage {
  message: string;
  reply: string;
  timestamp: Date;
}

export interface IChat extends mongoose.Document {
  userId: string;
  messages: IChatMessage[];
  updatedAt: Date;
  createdAt: Date;
}

const ChatMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  reply: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  messages: {
    type: [ChatMessageSchema],
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better performance
ChatSchema.index({ userId: 1, updatedAt: -1 });

export const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

// lib/database.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

// utils/chatHistory.ts
import { Chat, IChatMessage } from '../models/Chat';
import { connectToDatabase } from '../lib/database';

interface SaveChatResult {
  success?: boolean;
  error?: string;
  details?: string;
}

interface SessionUser {
  id: string;
  email?: string;
  name?: string;
}

interface Session {
  user: SessionUser;
}

export async function saveChatHistory(
  messageData: string | any,
  replyData: string | any,
  session: Session
): Promise<SaveChatResult> {
  const startTime = Date.now();
  
  try {
    // 1. Validate inputs
    console.log('🔍 Validating inputs...');
    
    if (!session?.user?.id) {
      console.error('❌ No valid session user ID provided');
      return { error: "Authentication required - no valid user session" };
    }

    // Convert inputs to strings safely
    const messageStr = typeof messageData === 'string' ? messageData : 
                      typeof messageData === 'object' ? JSON.stringify(messageData) :
                      String(messageData || '');
                      
    const replyStr = typeof replyData === 'string' ? replyData :
                    typeof replyData === 'object' ? JSON.stringify(replyData) :
                    String(replyData || '');

    if (!messageStr.trim() || !replyStr.trim()) {
      console.error('❌ Empty message or reply data:', { 
        messageLength: messageStr.length, 
        replyLength: replyStr.length 
      });
      return { error: "Message and reply cannot be empty" };
    }

    if (messageStr.length > 10000 || replyStr.length > 10000) {
      console.error('❌ Message or reply too long:', { 
        messageLength: messageStr.length, 
        replyLength: replyStr.length 
      });
      return { error: "Message or reply is too long (max 10,000 characters)" };
    }

    console.log('✅ Input validation passed:', {
      userId: session.user.id,
      messageLength: messageStr.length,
      replyLength: replyStr.length
    });

    // 2. Connect to database
    console.log('🔗 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connection established');

    // 3. Prepare chat entry
    const chatEntry: IChatMessage = {
      message: messageStr,
      reply: replyStr,
      timestamp: new Date()
    };

    console.log('📝 Prepared chat entry:', {
      userId: session.user.id,
      timestamp: chatEntry.timestamp,
      hasMessage: !!chatEntry.message,
      hasReply: !!chatEntry.reply
    });

    // 4. Check if user document exists
    console.log('🔍 Checking existing chat document...');
    const existingChat = await Chat.findOne({ userId: session.user.id });
    
    if (existingChat) {
      console.log('📋 Found existing chat document with', existingChat.messages.length, 'messages');
    } else {
      console.log('📝 No existing chat document found, will create new one');
    }

    // 5. Perform the update operation
    console.log('💾 Saving chat entry...');
    
    const updateResult = await Chat.updateOne(
      { userId: session.user.id },
      {
        $push: { 
          messages: {
            $each: [chatEntry],
            $slice: -1000 // Keep only last 1000 messages to prevent document from growing too large
          }
        },
        $set: { updatedAt: new Date() }
      },
      { 
        upsert: true,
        runValidators: true
      }
    );

    console.log('✅ Update operation completed:', {
      acknowledged: updateResult.acknowledged,
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      upsertedCount: updateResult.upsertedCount,
      upsertedId: updateResult.upsertedId
    });

    // 6. Verify the operation was successful
    if (!updateResult.acknowledged) {
      console.error('❌ Update operation was not acknowledged');
      return { 
        error: "Database operation failed - not acknowledged",
        details: "The database did not acknowledge the update operation"
      };
    }

    // 7. Double-check by fetching the updated document
    const updatedChat = await Chat.findOne({ userId: session.user.id });
    if (!updatedChat) {
      console.error('❌ Could not retrieve updated chat document');
      return { 
        error: "Failed to verify saved data",
        details: "Chat document was not found after update"
      };
    }

    const executionTime = Date.now() - startTime;
    console.log('🎉 Chat history saved successfully:', {
      userId: session.user.id,
      totalMessages: updatedChat.messages.length,
      executionTime: `${executionTime}ms`
    });

    return { success: true };

  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    
    console.error('❌ Error saving chat history:', {
      error: error.message,
      name: error.name,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      executionTime: `${executionTime}ms`
    });

    // Handle specific MongoDB errors
    let errorMessage = "Failed to save chat history";
    let errorDetails = error.message;

    if (error.name === 'ValidationError') {
      errorMessage = "Invalid data format";
      errorDetails = Object.values(error.errors).map((err: any) => err.message).join(', ');
    } else if (error.name === 'MongoNetworkError') {
      errorMessage = "Database connection failed";
      errorDetails = "Could not connect to the database";
    } else if (error.name === 'MongooseError') {
      errorMessage = "Database operation failed";
    } else if (error.code === 11000) {
      errorMessage = "Duplicate entry error";
      errorDetails = "A record with this data already exists";
    }

    return { 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    };
  }
}

// API route example: pages/api/chat/save.ts or app/api/chat/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // Adjust path as needed
import { saveChatHistory } from '../../../utils/chatHistory';

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message, reply } = body;

    if (!message || !reply) {
      return NextResponse.json(
        { error: "Message and reply are required" },
        { status: 400 }
      );
    }

    // Save chat history
    const result = await saveChatHistory(message, reply, session);

    if (result.error) {
      return NextResponse.json(
        { 
          error: result.error,
          ...(result.details && { details: result.details })
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  }
}

// Client-side usage example
export async function saveUserChat(message: string, reply: string) {
  try {
    const response = await fetch('/api/chat/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, reply }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save chat');
    }

    console.log('✅ Chat saved successfully');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Failed to save chat:', error.message);
    return { error: error.message };
  }
}