import { prisma } from "./prisma";

// Seed data function for development
export async function seedDatabase() {
  const bcrypt = require("bcryptjs");
  const hashedPassword = bcrypt.hashSync("password123", 10);

  try {
    console.log("Starting database seeding...");

    // Create sample users
    const user1 = await prisma.user.upsert({
      where: { email: "john@example.com" },
      update: {},
      create: {
        name: "John Smith",
        email: "john@example.com",
        password: hashedPassword,
        avatar: null,
        interestedGenres: ["Science Fiction", "Fantasy", "Mystery"],
        birthday: "1990-05-15",
        location: "San Francisco, CA",
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: "jane@example.com" },
      update: {},
      create: {
        name: "Jane Doe",
        email: "jane@example.com",
        password: hashedPassword,
        avatar: null,
        interestedGenres: ["Classic Literature", "Romance"],
        location: "New York, NY",
      },
    });

    const user3 = await prisma.user.upsert({
      where: { email: "sarah@example.com" },
      update: {},
      create: {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        password: hashedPassword,
        avatar: null,
        interestedGenres: ["Contemporary Fiction", "Self-Help"],
        location: "Los Angeles, CA",
      },
    });

    const user4 = await prisma.user.upsert({
      where: { email: "mike@example.com" },
      update: {},
      create: {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: hashedPassword,
        avatar: null,
        interestedGenres: ["Biography", "History"],
        location: "Chicago, IL",
      },
    });

    console.log("Created users:", [user1.name, user2.name, user3.name, user4.name]);

    // Create sample books
    const books = [
      {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Classic Literature",
        condition: "Good" as const,
        description: "A masterpiece of American literature that captures the essence of the Jazz Age. This classic novel follows the mysterious Jay Gatsby and his obsession with the beautiful Daisy Buchanan.",
        ownerId: user1.id,
        image: null,
        isAvailable: true,
      },
      {
        id: "2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic Literature",
        condition: "New" as const,
        description: "A gripping tale of racial injustice and childhood innocence in the American South. This powerful novel explores themes of morality, prejudice, and the loss of innocence.",
        ownerId: user2.id,
        image: null,
        isAvailable: true,
      },
      {
        id: "3",
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        condition: "Good" as const,
        description: "Epic space opera about politics and ecology on the desert planet Arrakis. A masterwork of science fiction that explores themes of power, religion, and environmental consciousness.",
        ownerId: user1.id,
        image: null,
        isAvailable: true,
      },
      {
        id: "4",
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        genre: "Contemporary Fiction",
        condition: "New" as const,
        description: "A captivating novel about a reclusive Hollywood icon who finally decides to tell her story to an unknown journalist.",
        ownerId: user3.id,
        image: null,
        isAvailable: true,
      },
      {
        id: "5",
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-Help",
        condition: "Good" as const,
        description: "Transform your life with tiny changes in this practical guide to building good habits and breaking bad ones.",
        ownerId: user4.id,
        image: null,
        isAvailable: true,
      },
      {
        id: "6",
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: "Contemporary Fiction",
        condition: "Good" as const,
        description: "A novel about infinite possibilities and the lives we might have lived. Between life and death there is a library.",
        ownerId: user3.id,
        image: null,
        isAvailable: true,
      },
      {
        id: "7",
        title: "Educated",
        author: "Tara Westover",
        genre: "Biography",
        condition: "Worn" as const,
        description: "A powerful memoir about education, family, and the struggle for self-invention. A coming-of-age story that is both heartbreaking and inspiring.",
        ownerId: user4.id,
        image: null,
        isAvailable: true,
      },
      {
        id: "8",
        title: "1984",
        author: "George Orwell",
        genre: "Classic Literature",
        condition: "Good" as const,
        description: "A dystopian masterpiece about totalitarianism and the power of language. More relevant today than ever before.",
        ownerId: user2.id,
        image: null,
        isAvailable: false, // This one is being exchanged
      },
      // Additional books for exchange history
      {
        id: "9",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Classic Literature",
        condition: "Good" as const,
        description: "A romantic novel about Elizabeth Bennet and Mr. Darcy. A timeless classic exploring themes of love, class, and social expectations.",
        ownerId: user3.id,
        image: null,
        isAvailable: false, // Exchanged
      },
      {
        id: "10",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        genre: "Classic Literature",
        condition: "Worn" as const,
        description: "A controversial coming-of-age novel about Holden Caulfield. A powerful exploration of teenage alienation and the loss of innocence.",
        ownerId: user4.id,
        image: null,
        isAvailable: false, // Exchanged
      },
      {
        id: "11",
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
        condition: "Good" as const,
        description: "The first book in the beloved Harry Potter series. A magical adventure that captivated readers of all ages.",
        ownerId: user1.id,
        image: null,
        isAvailable: false, // Exchanged
      },
      {
        id: "12",
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        condition: "New" as const,
        description: "Epic fantasy trilogy about the quest to destroy the One Ring. A masterpiece of world-building and storytelling.",
        ownerId: user2.id,
        image: null,
        isAvailable: false, // Exchanged
      },
    ];

    for (const book of books) {
      await prisma.book.upsert({
        where: { id: book.id },
        update: {},
        create: book,
      });
    }

    console.log(`Created ${books.length} books`);

    // Create sample exchange requests
    const exchangeRequests = [
      {
        id: "exchange1",
        bookId: "1", // The Great Gatsby
        requesterId: user2.id, // Jane requesting
        ownerId: user1.id, // from John
        status: "pending" as const,
      },
      {
        id: "exchange2",
        bookId: "8", // 1984
        requesterId: user3.id, // Sarah requesting
        ownerId: user2.id, // from Jane
        status: "accepted" as const,
      },
      // Completed exchanges for history
      {
        id: "exchange3",
        bookId: "9", // Pride and Prejudice
        requesterId: user1.id, // John requesting
        ownerId: user3.id, // from Sarah
        status: "accepted" as const,
        createdAt: new Date("2024-11-28T09:15:00Z") as Date,
        updatedAt: new Date("2024-11-28T10:15:00Z") as Date,
      },
      {
        id: "exchange4",
        bookId: "10", // The Catcher in the Rye
        requesterId: user2.id, // Jane requesting
        ownerId: user4.id, // from Mike
        status: "accepted" as const,
        createdAt: new Date("2024-11-20T11:00:00Z") as Date,
        updatedAt: new Date("2024-11-20T12:00:00Z") as Date,
      },
      {
        id: "exchange5",
        bookId: "11", // Harry Potter
        requesterId: user3.id, // Sarah requesting
        ownerId: user1.id, // from John
        status: "accepted" as const,
        createdAt: new Date("2024-11-15T13:30:00Z") as Date,
        updatedAt: new Date("2024-11-15T14:30:00Z") as Date,
      },
      {
        id: "exchange6",
        bookId: "12", // Lord of the Rings
        requesterId: user4.id, // Mike requesting
        ownerId: user2.id, // from Jane
        status: "accepted" as const,
        createdAt: new Date("2024-11-08T15:45:00Z") as Date,
        updatedAt: new Date("2024-11-08T16:45:00Z") as Date,
      },
      {
        id: "exchange7",
        bookId: "3", // Dune (adding another exchange for variety)
        requesterId: user4.id, // Mike requesting
        ownerId: user1.id, // from John
        status: "accepted" as const,
        createdAt: new Date("2024-10-25T12:20:00Z") as Date,
        updatedAt: new Date("2024-10-25T13:20:00Z") as Date,
      },
    ] as Array<{
      id: string;
      bookId: string;
      requesterId: string;
      ownerId: string;
      status: "pending" | "accepted" | "rejected";
      createdAt?: Date;
      updatedAt?: Date;
    }>;

    for (const request of exchangeRequests) {
      await prisma.exchangeRequest.upsert({
        where: { id: request.id },
        update: {},
        create: {
          id: request.id,
          bookId: request.bookId,
          requesterId: request.requesterId,
          ownerId: request.ownerId,
          status: request.status,
          ...(request.createdAt && { createdAt: request.createdAt }),
          ...(request.updatedAt && { updatedAt: request.updatedAt }),
        },
      });
    }

    console.log(`Created ${exchangeRequests.length} exchange requests`);

    // Create sample notifications
    const notifications = [
      {
        id: "notif1",
        userId: user1.id,
        title: "Welcome to BookSwap!",
        message: "Complete your profile to get better recommendations",
        type: "welcome" as const,
        isRead: false,
        relatedId: null,
      },
      {
        id: "notif2",
        userId: user1.id,
        title: "New Exchange Request",
        message: "Jane Doe wants to exchange for 'The Great Gatsby'",
        type: "exchange" as const,
        isRead: false,
        relatedId: "exchange1",
      },
      {
        id: "notif3",
        userId: user2.id,
        title: "Welcome to BookSwap!",
        message: "Start listing your books to connect with other readers",
        type: "welcome" as const,
        isRead: true,
        relatedId: null,
      },
      {
        id: "notif4",
        userId: user3.id,
        title: "Exchange Accepted!",
        message: "Your request for '1984' has been accepted",
        type: "accepted" as const,
        isRead: false,
        relatedId: "exchange2",
      },
    ];

    for (const notification of notifications) {
      await prisma.notification.upsert({
        where: { id: notification.id },
        update: {},
        create: notification,
      });
    }

    console.log(`Created ${notifications.length} notifications`);

    // Create sample chat threads
    const chatThreads = [
      {
        id: "thread1",
        bookId: "1", // The Great Gatsby
        participantAId: user1.id, // John (book owner)
        participantBId: user2.id, // Jane (interested user)
      },
      {
        id: "thread2", 
        bookId: "3", // Dune
        participantAId: user1.id, // John (book owner)
        participantBId: user3.id, // Sarah (interested user)
      },
      {
        id: "thread3",
        bookId: "2", // To Kill a Mockingbird
        participantAId: user2.id, // Jane (book owner)
        participantBId: user1.id, // John (interested user)
      },
      {
        id: "thread4",
        bookId: "4", // The Seven Husbands of Evelyn Hugo
        participantAId: user3.id, // Sarah (book owner)
        participantBId: user1.id, // John (interested user)
      },
      {
        id: "thread5",
        bookId: "5", // Atomic Habits
        participantAId: user4.id, // Mike (book owner)
        participantBId: user1.id, // John (interested user)
      },
    ];

    for (const thread of chatThreads) {
      await prisma.chatThread.upsert({
        where: { id: thread.id },
        update: {},
        create: thread,
      });
    }

    console.log(`Created ${chatThreads.length} chat threads`);

    // Create sample chat messages
    const chatMessages = [
      // Conversation 1: John & Jane about The Great Gatsby
      {
        id: "msg1",
        threadId: "thread1",
        senderId: user2.id, // Jane
        message: "Hi! I'm really interested in 'The Great Gatsby'. Is it still available for exchange?",
        isRead: true,
        createdAt: new Date("2024-12-01T10:00:00Z"),
      },
      {
        id: "msg2",
        threadId: "thread1",
        senderId: user1.id, // John
        message: "Hi Jane! Yes, it's still available. It's in good condition with minimal wear. What book were you thinking of exchanging?",
        isRead: true,
        createdAt: new Date("2024-12-01T10:15:00Z"),
      },
      {
        id: "msg3",
        threadId: "thread1",
        senderId: user2.id, // Jane
        message: "I have 'To Kill a Mockingbird' in excellent condition, or 'The Handmaid's Tale' if you prefer something more contemporary.",
        isRead: true,
        createdAt: new Date("2024-12-01T10:30:00Z"),
      },
      {
        id: "msg4",
        threadId: "thread1",
        senderId: user1.id, // John
        message: "To Kill a Mockingbird sounds perfect! I've been wanting to read that. When would be a good time to meet?",
        isRead: false,
        createdAt: new Date("2024-12-01T11:00:00Z"),
      },

      // Conversation 2: John & Sarah about Dune
      {
        id: "msg5",
        threadId: "thread2",
        senderId: user3.id, // Sarah
        message: "Hey! I saw your listing for Dune. I'm a huge sci-fi fan and have been dying to read it!",
        isRead: true,
        createdAt: new Date("2024-11-30T14:00:00Z"),
      },
      {
        id: "msg6",
        threadId: "thread2",
        senderId: user1.id, // John
        message: "Hi Sarah! Dune is an amazing book - one of my all-time favorites. It's yours if you have something good to trade!",
        isRead: true,
        createdAt: new Date("2024-11-30T14:20:00Z"),
      },
      {
        id: "msg7",
        threadId: "thread2",
        senderId: user3.id, // Sarah
        message: "I have 'The Seven Husbands of Evelyn Hugo' and 'The Midnight Library' - both in great condition. Any interest?",
        isRead: true,
        createdAt: new Date("2024-11-30T15:00:00Z"),
      },
      {
        id: "msg8",
        threadId: "thread2",
        senderId: user1.id, // John
        message: "The Seven Husbands of Evelyn Hugo sounds intriguing! I'd love to trade for that. Are you free this weekend?",
        isRead: true,
        createdAt: new Date("2024-11-30T15:30:00Z"),
      },
      {
        id: "msg9",
        threadId: "thread2",
        senderId: user3.id, // Sarah
        message: "Perfect! How about Saturday afternoon at the Starbucks on Main Street?",
        isRead: false,
        createdAt: new Date("2024-12-01T09:00:00Z"),
      },

      // Conversation 3: Jane & John about To Kill a Mockingbird
      {
        id: "msg10",
        threadId: "thread3",
        senderId: user1.id, // John
        message: "Hi Jane! I noticed you have 'To Kill a Mockingbird'. Would you be interested in trading it?",
        isRead: true,
        createdAt: new Date("2024-11-29T16:00:00Z"),
      },
      {
        id: "msg11",
        threadId: "thread3",
        senderId: user2.id, // Jane
        message: "Hi John! Sure, I'd consider it. What do you have available?",
        isRead: true,
        createdAt: new Date("2024-11-29T16:30:00Z"),
      },
      {
        id: "msg12",
        threadId: "thread3",
        senderId: user1.id, // John
        message: "I have 'The Great Gatsby' and 'Dune'. Both are in good condition.",
        isRead: false,
        createdAt: new Date("2024-11-29T17:00:00Z"),
      },

      // Conversation 4: Sarah & John about The Seven Husbands of Evelyn Hugo
      {
        id: "msg13",
        threadId: "thread4",
        senderId: user1.id, // John
        message: "Hi Sarah! I've heard amazing things about 'The Seven Husbands of Evelyn Hugo'. Is it as good as everyone says?",
        isRead: true,
        createdAt: new Date("2024-11-28T12:00:00Z"),
      },
      {
        id: "msg14",
        threadId: "thread4",
        senderId: user3.id, // Sarah
        message: "It's absolutely incredible! One of the best books I've read this year. The character development is phenomenal.",
        isRead: true,
        createdAt: new Date("2024-11-28T12:30:00Z"),
      },
      {
        id: "msg15",
        threadId: "thread4",
        senderId: user1.id, // John
        message: "That settles it - I need to read it! Would you be open to an exchange?",
        isRead: true,
        createdAt: new Date("2024-11-28T13:00:00Z"),
      },
      {
        id: "msg16",
        threadId: "thread4",
        senderId: user3.id, // Sarah
        message: "Definitely! What genres do you have? I'm always looking for good sci-fi or fantasy.",
        isRead: false,
        createdAt: new Date("2024-11-28T13:15:00Z"),
      },

      // Conversation 5: Mike & John about Atomic Habits
      {
        id: "msg17",
        threadId: "thread5",
        senderId: user1.id, // John
        message: "Hey Mike! I'm trying to build better habits this year. How did you find 'Atomic Habits'?",
        isRead: true,
        createdAt: new Date("2024-11-27T20:00:00Z"),
      },
      {
        id: "msg18",
        threadId: "thread5",
        senderId: user4.id, // Mike
        message: "It's a game-changer! Really practical advice that actually works. I've built several new habits using his methods.",
        isRead: true,
        createdAt: new Date("2024-11-27T20:30:00Z"),
      },
      {
        id: "msg19",
        threadId: "thread5",
        senderId: user1.id, // John
        message: "That's exactly what I need to hear! Would you be willing to trade it?",
        isRead: true,
        createdAt: new Date("2024-11-27T21:00:00Z"),
      },
      {
        id: "msg20",
        threadId: "thread5",
        senderId: user4.id, // Mike
        message: "Sure! I'm looking for some good fiction or sci-fi. What do you have?",
        isRead: false,
        createdAt: new Date("2024-11-27T21:15:00Z"),
      },
    ];

    for (const message of chatMessages) {
      await prisma.chatMessage.upsert({
        where: { id: message.id },
        update: {},
        create: message,
      });
    }

    console.log(`Created ${chatMessages.length} chat messages`);

    console.log("Database seeded successfully!");
    console.log("\nSample users created:");
    console.log("- john@example.com (password: password123)");
    console.log("- jane@example.com (password: password123)");
    console.log("- sarah@example.com (password: password123)");
    console.log("- mike@example.com (password: password123)");
    console.log("\nChat conversations created for user1 (John) with all other users!");
    console.log("Log in as john@example.com to see the chat interface with sample conversations.");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Function to clear all data (useful for testing)
export async function clearDatabase() {
  try {
    console.log("Clearing database...");
    
    // Delete in order to respect foreign key constraints
    await prisma.chatMessage.deleteMany();
    await prisma.chatThread.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.exchangeRequest.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    
    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
}

// Function to reset and seed database
export async function resetDatabase() {
  await clearDatabase();
  await seedDatabase();
}
