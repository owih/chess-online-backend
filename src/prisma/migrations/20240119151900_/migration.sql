-- CreateEnum
CREATE TYPE "CurrentPlayer" AS ENUM ('WHITE', 'BLACK');

-- CreateEnum
CREATE TYPE "ChessGameProcess" AS ENUM ('STARTED', 'PAUSED', 'ENDED', 'RESUMED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChessGameRoom" (
    "id" SERIAL NOT NULL,
    "state" TEXT,
    "gameId" TEXT NOT NULL,
    "whitePlayerId" INTEGER,
    "blackPlayerId" INTEGER,
    "viewersId" INTEGER[],
    "currentPlayer" "CurrentPlayer" NOT NULL,
    "gameProcess" "ChessGameProcess" NOT NULL,

    CONSTRAINT "ChessGameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChessGameRoom_gameId_key" ON "ChessGameRoom"("gameId");
