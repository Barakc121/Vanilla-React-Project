import express from 'express'
import cors from 'cors'

const PORT = 3000;
const app=express()


app.use(cors({
// origin: 'http://wrong-domain.com'
origin: '*'    
}));

app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: "hello from Barak"});
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});