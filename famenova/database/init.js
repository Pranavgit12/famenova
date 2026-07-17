db = db.getSiblingDB('rex_agency');

db.createCollection('leads');
db.createCollection('users');

db.leads.createIndex({ email: 1 });
db.leads.createIndex({ status: 1 });
db.leads.createIndex({ niche: 1 });
db.leads.createIndex({ submittedAt: -1 });
db.leads.createIndex({ createdAt: -1 });

db.users.createIndex({ email: 1 }, { unique: true });

db.users.insertOne({
  name: 'Admin',
  email: 'admin@rexagency.com',
  password: '$2a$12$LJ3m4ys3Lk0TSwHjxwCuMOJGKJh6x7Bq3M9y7Y3Fh5kDj8XnVqZbK',
  role: 'admin',
  createdAt: new Date()
});

print('Database initialized successfully');
