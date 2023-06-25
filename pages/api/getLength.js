import prisma from '@/prismaInstance';

export default async (req, res) => {
    const length = await prisma.message.count();
    res.status(200).json({length:length});
}