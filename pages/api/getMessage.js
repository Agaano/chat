import prisma from '@/prismaInstance';

function subtractArrayObjects(arr1, arr2) {
    return arr1.filter(obj1 => !arr2.some(obj2 => obj1.id === obj2.id));
}

export default async (req, res) => {
    if (req.method === 'POST') {
        const {messages} = req.body;
        const oldData = messages;
        const newData = await prisma.message.findMany();
        const diff = subtractArrayObjects(newData,oldData);
        res.status(200).json({messages: diff});
    }
}