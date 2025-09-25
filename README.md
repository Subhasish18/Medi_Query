<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<h1>My Portfolio (MERN Stack)</h1>
<p>This is a full-stack portfolio project built using the <strong>MERN stack</strong>: <strong>MongoDB, Express, React (Vite), and Node.js</strong>. It showcases my projects and allows users to get in touch or subscribe to my newsletter.</p>

<hr>

<h2>Project Structure</h2>
<pre>
<code>
my-portfolio/
│
├── client/                    # React Frontend
│   ├── public/                 # Public assets (index.html, icons)
│   └── src/                    
│       ├── components/         # Reusable Components
│       ├── App.jsx             # Main App Component
│       └── main.jsx            # Vite Entry Point
│
├── server/                     # Node.js Backend
│   ├── config/                 # Configuration files
│   │   └── config.js           # DB Connection setup
│   ├── models/                 # Mongoose Schemas
│   ├── routes/                 # API Routes
│   ├── server.js               # Express App Entry Point
│   └── .env                    # Environment Variables (not pushed to GitHub)
│
└── README.md                   # Project Documentation
</code>
</pre>

<hr>

<h2>Tech Stack</h2>

<h3>Frontend:</h3>
<ul>
    <li><strong>React (Vite)</strong>: Fast and optimized development.</li>
    <li><strong>Axios</strong>: For making HTTP requests.</li>
    <li><strong>CSS Modules</strong>: Scoped and maintainable styling.</li>
</ul>

<h3>Backend:</h3>
<ul>
    <li><strong>Node.js</strong>: JavaScript runtime for server-side.</li>
    <li><strong>Express.js</strong>: Web framework for APIs.</li>
    <li><strong>Mongoose</strong>: ODM for MongoDB.</li>
</ul>

<h3>Database:</h3>
<ul>
    <li><strong>MongoDB Atlas</strong>: Cloud-hosted NoSQL database.</li>
</ul>

<hr>

<h2>Features</h2>
<ul>
    <li><strong>Dynamic Portfolio Showcase</strong>: Display projects and experiences.</li>
    <li><strong>Responsive Design</strong>: Works on all devices.</li>
    <li><strong>Form Validation</strong>: Input validation with error handling.</li>
</ul>

<hr>

<h2>Minimap</h2>
<img src="showcase.PNG" />

<hr>

<h2>Getting Started</h2>

<h3>Prerequisites</h3>
<ul>
    <li><strong>Node.js</strong> and <strong>npm</strong></li>
    <li><strong>MongoDB Atlas</strong> cluster</li>
</ul>

<h3>Installation</h3>
<ol>
    <li>
        <strong>Clone the Repository</strong>
        <pre><code>
git clone https://github.com/your-username/my-portfolio.git
cd my-portfolio
        </code></pre>
    </li>

    <li>
        <strong>Install Dependencies</strong>
        <pre><code>
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
        </code></pre>
    </li>

    <li>
        <strong>Setup Environment Variables</strong>
        <p>Create a <code>.env</code> file in the <strong>server</strong> directory:</p>
        <pre><code>
MONGO_URI=your_mongo_db_connection_string
PORT=5000
        </code></pre>
    </li>
</ol>

<hr>

<h2>Running the App</h2>

<h3>Development Mode</h3>
<pre><code>
# Start the client
cd client
npm run dev

# Start the server
cd ../server
npm run dev
</code></pre>

<h3>Production Mode</h3>
<pre><code>
# Build frontend
cd client
npm run build

# Start backend
cd ../server
npm start
</code></pre>

<p>Frontend: <code>http://localhost:5173</code> | Backend: <code>http://localhost:5000</code></p>

<hr>

<h2>API Endpoints</h2>

<h3>Contact Form</h3>
<ul>
    <li><strong>POST</strong> <code>/api/contact</code> - Stores contact form submissions.</li>
</ul>

<h3>Newsletter Subscription</h3>
<ul>
    <li><strong>POST</strong> <code>/api/newsletter</code> - Stores newsletter subscriptions.</li>
</ul>

<hr>

<h2>Folder Structure Explained</h2>

<h3>Client Side (React + Vite)</h3>
<ul>
    <li><code>components/</code>: Reusable React components.</li>
    <li><code>App.jsx</code>: Main App with routes.</li>
    <li><code>main.jsx</code>: Entry point for React.</li>
</ul>

<h3>Server Side (Node.js + Express)</h3>
<ul>
    <li><code>config/config.js</code>: Handles MongoDB connection using <code>mongoose.connect()</code>.</li>
    <li><code>models/</code>: MongoDB schemas.</li>
    <li><code>routes/</code>: API endpoints (contact, newsletter, etc.).</li>
    <li><code>server.js</code>: Express app entry point.</li>
    <li><code>.env</code>: Sensitive environment variables.</li>
</ul>

<hr>

<h2>Deployment</h2>
<ol>
    <li><strong>Frontend:</strong> Host on <strong>Vercel</strong> or <strong>Netlify</strong>.</li>
    <li><strong>Backend:</strong> Host on <strong>Render</strong> or <strong>Railway</strong>.</li>
    <li><strong>Database:</strong> Use <strong>MongoDB Atlas</strong>.</li>
</ol>

<hr>

<h2>Scripts</h2>

<h3>Client Scripts</h3>
<pre><code>
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
</code></pre>

<h3>Server Scripts</h3>
<pre><code>
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
</code></pre>

<hr>

<h2>Contributing</h2>
<p>Feel free to fork this repo, open issues, and submit pull requests.</p>

<hr>

<h2>License</h2>
<p>This project is licensed under the <strong>MIT License</strong>.</p>

<hr>

<h2>Contact</h2>
<ul>
    <li><strong>Name:</strong> Surath Chowdhury</li>
    <li><strong>Email:</strong> surath172003@gmail.com</li>
    <li><strong>LinkedIn:</strong> surath chowdhury</li>
</ul>

</body>
</html>
