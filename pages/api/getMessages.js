import prisma from '@/prismaInstance';

export default async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    let oldLength = await prisma.message.count();
    let oldData = await prisma.message.findMany();
    function subtractArrayObjects(arr1, arr2) {
      return arr1.filter(obj1 => !arr2.some(obj2 => obj1.id === obj2.id));
    }

    const intervalId = setInterval(async () => {
      const length = await prisma.message.count()
      if (length !== oldLength) {
        const data = await prisma.message.findMany()
        const diff = subtractArrayObjects(data, oldData);
        oldData = data;
        oldLength = length;
        const eventData = `data: ${JSON.stringify(diff)}\n\n`;
        res.write(eventData);
      }

    }, 1000);
  
    req.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
};