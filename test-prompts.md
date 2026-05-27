# Test Prompts for pdfgen

## Resume

```
Create a resume for Jane Smith, a Senior Software Engineer. Her email is jane@example.com, phone is 555-0100. She has 6 years of experience at Google working on full-stack web applications using React, TypeScript, and Go. She led a team of 4 engineers building a real-time analytics dashboard. Before that, she spent 2 years at Amazon working on backend services in Java and AWS. She has a B.S. in Computer Science from MIT (2018). Her skills include React, TypeScript, Go, Python, AWS, PostgreSQL, and Docker. She's also certified as an AWS Solutions Architect. Her professional summary is a full-stack engineer passionate about building scalable web applications.
```

```
Create a resume for John Doe, a data scientist. Email john@datasci.com, phone 555-0200. PhD in Statistics from Stanford (2020). 4 years at Netflix building recommendation systems with Python, TensorFlow, and PySpark. 2 years prior at Spotify doing user behavior analysis. Skills: Python, R, TensorFlow, PySpark, SQL, Tableau, scikit-learn. Certified in AWS Machine Learning. Summary: data scientist with 6 years experience applying ML to consumer products.
```

## Invoice

```
Create an invoice for consulting services. Invoice number INV-2024-001, issued Jan 15 2024, due Feb 15 2024. Sender: Felix Engineering, 123 Main St, felix@example.com. Recipient: Acme Corp, 456 Oak Ave, billing@acme.com. Line items: Senior backend consulting (40hrs at $200/hr = $8000), Architecture review (10hrs at $250/hr = $2500). Subtotal $10500, tax 8% ($840), total $11340. Notes: Payment via wire transfer within 30 days.
```

```
Create a simple invoice. Invoice 001, dated today. From: Alice Design, alice@design.co. To: Bob's Bakery, bob@bakery.com. One item: Logo design, 1 unit at $500. Total $500.
```

## Letter

```
Write a formal letter dated March 1 2024 to Sarah Johnson at 456 Elm Street, regarding her job application. Subject: Application for Senior Designer Position. Body: Thank you for your interest in the Senior Designer position at our company. After careful review of your portfolio and experience, we are pleased to invite you for an interview. Please contact us to schedule a time. Closing: Best regards, signed by Thomas Lee, HR Director.
```

```
Write a letter of recommendation. Date: today. Recipient: Admissions Committee, 100 University Ave. Subject: Recommendation for Mark Brown. Body: I am writing to recommend Mark Brown for your graduate program. I have supervised Mark for three years as his manager at Tech Corp, where he consistently demonstrated exceptional analytical skills and dedication. He led our data migration project, delivering ahead of schedule. I am confident he will excel in your program. Closing: Sincerely, signed by Dr. Emily White, VP of Engineering.
```

## Multi-turn (partial data — tests the agent asking follow-ups)

```
Make an invoice for $2500 to Widget Corp.
```

```
I need a resume for a marketing manager.
```

```
Write a letter to Ms. Davis about her grant proposal.
```

Create a confidential resume for Jane Smith, a Senior Software Engineer. Her email is jane@example.com, phone is 555-0100. She has 6 years of experience at Google working on full-stack web applications using React, TypeScript, and Go. She led a team of 4 engineers building a real-time analytics dashboard. Before that, she spent 2 years at Amazon working on backend services in Java and AWS. She has a B.S. in Computer Science from MIT (2018). Her skills include React, TypeScript, Go, Python, AWS, PostgreSQL, and Docker. She's also certified as an AWS Solutions Architect. Her professional summary is a full-stack engineer passionate about building scalable web applications.


