-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "number" TEXT;

-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "number" TEXT,
ADD COLUMN     "state" TEXT;
