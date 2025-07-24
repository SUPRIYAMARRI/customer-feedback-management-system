const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = 3019;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/supriya', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Schema
const feedbackSchema = new mongoose.Schema({
  regd_no: String,
  name: String,
  email: String,
  company: String,
  product: String,
  price: Number,
  category: [String],
  rating: Number,
  feedback: String,
  image: String
});

// Models for each collection (note: Mongoose auto-pluralizes collection names)
const Feedback = mongoose.model('Feedback', feedbackSchema); // stores in 'feedbacks'
const QualityFeedback = mongoose.model('QualityFeedback', feedbackSchema, 'quality_feedback');
const SupportFeedback = mongoose.model('SupportFeedback', feedbackSchema, 'support_feedback');
const ServiceFeedback = mongoose.model('ServiceFeedback', feedbackSchema, 'service_feedback');
const DeliveryFeedback = mongoose.model('DeliveryFeedback', feedbackSchema, 'delivery_feedback');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve the form.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Handle form submission
app.post('/', upload.single('image'), async (req, res) => {
  try {
    const categories = Array.isArray(req.body.category) ? req.body.category : [req.body.category];
    
    const feedbackData = {
      regd_no: req.body.regd_no,
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      product: req.body.product,
      price: Number(req.body.price),
      category: categories,
      rating: Number(req.body.rating),
      feedback: req.body.feedback,
      image: req.file ? req.file.filename : null
    };

    // Save in main feedbacks collection
    const feedback = new Feedback(feedbackData);
    await feedback.save();

    // Save in category-specific collections
    for (const cat of categories) {
      switch (cat) {
        case 'Quality':
          await new QualityFeedback(feedbackData).save();
          break;
        case 'Support':
          await new SupportFeedback(feedbackData).save();
          break;
        case 'Service':
          await new ServiceFeedback(feedbackData).save();
          break;
        case 'Delivery':
          await new DeliveryFeedback(feedbackData).save();
          break;
        default:
          console.log(`Unknown category: ${cat}`);
      }
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).send('Error submitting form.');
  }
});

// Dashboard page to show all feedback grouped by category
app.get('/dashboard', async (req, res) => {
  const feedbacks = await Feedback.find().sort({ _id: -1 });
  const categories = ['Quality', 'Service', 'Delivery', 'Support'];
  const categorized = {};

  categories.forEach(cat => {
    categorized[cat] = feedbacks.filter(fb => fb.category.includes(cat));
  });

  let html = `<h1>Feedback Dashboard</h1><a href="/">&larr; Submit More Feedback</a><br><br>`;

  categories.forEach(cat => {
    html += `<h2>${cat} Feedbacks</h2><ul>`;
    if (categorized[cat].length === 0) {
      html += `<li>No feedback in this category.</li>`;
    } else {
      categorized[cat].forEach(fb => {
        html += `<li style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px; border-radius: 8px;">
          <strong>Name:</strong> ${fb.name}<br>
          <strong>Email:</strong> ${fb.email}<br>
          <strong>Company:</strong> ${fb.company || 'N/A'}<br>
          <strong>Product:</strong> ${fb.product}<br>
          <strong>Price:</strong> ₹${fb.price}<br>
          <strong>Categories:</strong> ${fb.category.join(', ')}<br>
          <strong>Rating:</strong> ${fb.rating} / 5<br>
          <strong>Feedback:</strong> ${fb.feedback}<br>
          ${fb.image ? `<strong>Image:</strong><br><img src="/uploads/${fb.image}" width="150" style="margin-top:5px;"><br>` : ''}
        </li>`;
      });
    }
    html += `</ul><hr>`;
  });

  res.send(html);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});





