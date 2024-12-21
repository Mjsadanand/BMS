import express from 'express';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRouter from './routes/auth.js';
import propertyOwnerRoutes from './routes/propertyOwnerRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import clientRouter from './routes/clientRoutes.js';
import connectToDatabase from './db/db.js';
import accountRoutes from './routes/accountRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import adContractRoutes from './routes/adContractRoutes.js';
import adRoutes from './routes/adRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import Property from './models/Property.js';
import Billboard from './models/Billboard.js';
import Customer from './models/Client.js';

dotenv.config();
 
// Validate essential environment variables
if (!process.env.PORT) {
  throw new Error('Missing essential environment variables!');
}

// Connect to the database
connectToDatabase();

const app = express();

const _dirname = path.resolve();
// Resolve the __dirname equivalent
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Middleware for CORS, JSON parsing, and security headers
app.use(cors());
app.use(express.json());
app.use(helmet());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/account', accountRoutes);
app.use('/api/property-owners', propertyOwnerRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/clients', clientRouter);
app.use('/api/staff', staffRoutes);
app.use('/api/ad-contracts', adContractRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/invoices', invoiceRoutes);

app.get('/api/dashboard-data', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const activeBillboards = await Billboard.countDocuments({ isActive: true });
    const totalRevenue = await Billboard.aggregate([
      { $group: { _id: null, total: { $sum: '$revenue' } } },
    ]);
    const totalCustomers = await Customer.countDocuments(); // Total customers
    const activeCustomers = await Customer.countDocuments({ isActive: true }); // Active customers

    // Generate activities dynamically from recent database interactions
    const recentProperties = await Property.find().sort({ _id: -1 }).limit(5);
    const recentBillboards = await Billboard.find().sort({ _id: -1 }).limit(5);
    const recentClients = await Customer.find().sort({ _id: -1 }).limit(5);
    const recentActivities = [
      ...recentProperties.map(property => ({
        title: `Property Added: ${property.address}`,
        description: `Location Type: ${property.location_type}`,
        time: property._id.getTimestamp(), // Extract timestamp from MongoDB ObjectId
      })),
      ...recentBillboards.map(billboard => ({
        title: `Billboard Updated`,
        description: `Revenue: $${billboard.revenue}`,
        time: billboard._id.getTimestamp(),
      })),
      ...recentClients.map(client => ({
        title: `Client Added: ${client.company_name}`,
        description: `Email: ${client.email}`, // You can replace this with another field of your choice
        time: client._id.getTimestamp(),
      })),
    ];

    res.status(200).json({
      totalProperties,
      activeBillboards,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalCustomers, // Include total customers in the response
      activeCustomers,
      recentActivities,
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.use(express.static(path.join(_dirname,"/frontend/dist")));
app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
})
// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at the port ${PORT}`);
});
