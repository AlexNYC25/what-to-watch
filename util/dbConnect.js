import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_DB;

if(!MONGODB_URI) {
  throw new Error('MongoDB URI must be provided');
}

let cached = global.mongoose

if(!cached) {
  cached = global.mongoose = {conn: null, promise: null};
}

async function dbConnect() {
  if(cached.conn) {
    return cached.conn;
  }
  
  if(!cached.promise){
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });

  }

  cached.conn = await cached.promise;

  return cached.conn;

}


export default dbConnect;