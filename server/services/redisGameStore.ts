import { redisClient, isRedisAvailable } from "../redis";
import type { GameRoom } from "@shared/schema";

const ROOM_PREFIX = "room:";
const ROOM_CODE_PREFIX = "roomcode:";
const PLAYER_ROOM_PREFIX = "player:";
const ROOM_TTL = 60 * 60 * 4; // 4 hours

// In-memory fallback for development when Redis is unavailable
const inMemoryRooms = new Map<string, GameRoom>();
const inMemoryRoomCodes = new Map<string, string>(); // code -> roomId
const inMemoryPlayerRooms = new Map<string, string>(); // playerId -> roomId

export class RedisGameStore {
  async saveRoom(room: GameRoom): Promise<void> {
    if (!isRedisAvailable()) {
      // Fallback to in-memory storage
      inMemoryRooms.set(room.id, room);
      inMemoryRoomCodes.set(room.code, room.id);
      for (const player of room.players) {
        inMemoryPlayerRooms.set(player.id, room.id);
      }
      return;
    }

    try {
      const key = `${ROOM_PREFIX}${room.id}`;
      const codeKey = `${ROOM_CODE_PREFIX}${room.code}`;
      
      await Promise.all([
        redisClient.setEx(key, ROOM_TTL, JSON.stringify(room)),
        redisClient.setEx(codeKey, ROOM_TTL, room.id),
      ]);
      
      // Map each player to their room
      for (const player of room.players) {
        await redisClient.setEx(
          `${PLAYER_ROOM_PREFIX}${player.id}`,
          ROOM_TTL,
          room.id
        );
      }
    } catch (error) {
      console.error("Redis saveRoom failed, falling back to in-memory:", error);
      // Fallback to in-memory on error
      inMemoryRooms.set(room.id, room);
      inMemoryRoomCodes.set(room.code, room.id);
      for (const player of room.players) {
        inMemoryPlayerRooms.set(player.id, room.id);
      }
    }
  }

  async getRoom(roomId: string): Promise<GameRoom | null> {
    if (!isRedisAvailable()) {
      return inMemoryRooms.get(roomId) || null;
    }

    try {
      const key = `${ROOM_PREFIX}${roomId}`;
      const data = await redisClient.get(key);
      
      if (!data) return null;
      
      return JSON.parse(data) as GameRoom;
    } catch (error) {
      console.error("Redis getRoom failed, falling back to in-memory:", error);
      return inMemoryRooms.get(roomId) || null;
    }
  }

  async getRoomByCode(code: string): Promise<GameRoom | null> {
    if (!isRedisAvailable()) {
      const roomId = inMemoryRoomCodes.get(code);
      return roomId ? this.getRoom(roomId) : null;
    }

    try {
      const codeKey = `${ROOM_CODE_PREFIX}${code}`;
      const roomId = await redisClient.get(codeKey);
      
      if (!roomId) return null;
      
      return this.getRoom(roomId);
    } catch (error) {
      console.error("Redis getRoomByCode failed, falling back to in-memory:", error);
      const roomId = inMemoryRoomCodes.get(code);
      return roomId ? this.getRoom(roomId) : null;
    }
  }

  async getRoomByPlayerId(playerId: string): Promise<GameRoom | null> {
    if (!isRedisAvailable()) {
      const roomId = inMemoryPlayerRooms.get(playerId);
      return roomId ? this.getRoom(roomId) : null;
    }

    try {
      const playerKey = `${PLAYER_ROOM_PREFIX}${playerId}`;
      const roomId = await redisClient.get(playerKey);
      
      if (!roomId) return null;
      
      return this.getRoom(roomId);
    } catch (error) {
      console.error("Redis getRoomByPlayerId failed, falling back to in-memory:", error);
      const roomId = inMemoryPlayerRooms.get(playerId);
      return roomId ? this.getRoom(roomId) : null;
    }
  }

  async deleteRoom(roomId: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) return;

    if (!isRedisAvailable()) {
      inMemoryRooms.delete(roomId);
      inMemoryRoomCodes.delete(room.code);
      for (const player of room.players) {
        inMemoryPlayerRooms.delete(player.id);
      }
      return;
    }
    
    try {
      const keys = [
        `${ROOM_PREFIX}${roomId}`,
        `${ROOM_CODE_PREFIX}${room.code}`,
        ...room.players.map((p) => `${PLAYER_ROOM_PREFIX}${p.id}`),
      ];
      
      await redisClient.del(keys);
    } catch (error) {
      console.error("Redis deleteRoom failed, falling back to in-memory:", error);
      inMemoryRooms.delete(roomId);
      inMemoryRoomCodes.delete(room.code);
      for (const player of room.players) {
        inMemoryPlayerRooms.delete(player.id);
      }
    }
  }

  async deletePlayerMapping(playerId: string): Promise<void> {
    if (!isRedisAvailable()) {
      inMemoryPlayerRooms.delete(playerId);
      return;
    }

    try {
      await redisClient.del(`${PLAYER_ROOM_PREFIX}${playerId}`);
    } catch (error) {
      console.error("Redis deletePlayerMapping failed, falling back to in-memory:", error);
      inMemoryPlayerRooms.delete(playerId);
    }
  }

  async extendRoomTTL(roomId: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) return;
    
    // In-memory storage doesn't need TTL extension
    if (!isRedisAvailable()) return;
    
    await this.saveRoom(room); // Refresh TTL in Redis
  }

  async getAllActiveRoomIds(): Promise<string[]> {
    if (!isRedisAvailable()) {
      return Array.from(inMemoryRooms.keys());
    }

    try {
      const pattern = `${ROOM_PREFIX}*`;
      const keys = await redisClient.keys(pattern);
      return keys.map((key) => key.replace(ROOM_PREFIX, ""));
    } catch (error) {
      console.error("Redis getAllActiveRoomIds failed, falling back to in-memory:", error);
      return Array.from(inMemoryRooms.keys());
    }
  }

  async isRoomCodeUnique(code: string): Promise<boolean> {
    if (!isRedisAvailable()) {
      return !inMemoryRoomCodes.has(code);
    }

    const room = await this.getRoomByCode(code);
    return room === null;
  }
}

export const redisGameStore = new RedisGameStore();
