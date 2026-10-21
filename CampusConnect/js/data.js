/* Realistic demo data. Dates are relative to today so the app always looks current. */
const DEMO = {
  announcements: () => [
    ['Mid-semester examination timetable released', 'The Semester 4 mid-term timetable is live on the portal. Exams begin in nine days and hall tickets can be collected from the Examination Cell.', 'Examination', -1, 'High', 'Controller of Examinations'],
    ['TCS and Infosys campus drive registrations open', 'Final-year students with 65% aggregate or above can register with the Placement Cell. Carry an updated resume and two ID proofs.', 'Placement', -2, 'High', 'Placement Cell'],
    ['Library open until 11 PM during exams', 'The central library will stay open until 11 PM on weekdays throughout the examination period. Silent study floors are on levels 2 and 3.', 'General', -3, 'Medium', 'Chief Librarian'],
    ['Revised syllabus for Data Structures', 'Units 4 and 5 have been updated to include graph algorithms. Revised notes are available under Study Resources.', 'Academic', -5, 'Medium', 'Dept. of Computer Science'],
    ['Spectrum Tech Fest: volunteers wanted', 'Join the logistics, design or hospitality teams for our annual tech fest. Volunteers receive participation certificates.', 'Event', -6, 'Low', 'Student Council'],
    ['Scholarship application deadline extended', 'The merit-cum-means scholarship deadline is extended by one week. Submit documents at the Student Support desk.', 'Academic', -8, 'High', 'Dean of Student Affairs'],
    ['Campus Wi-Fi maintenance on Sunday', 'Wi-Fi will be unavailable in hostel blocks between 2 AM and 5 AM on Sunday while the network is upgraded.', 'General', -10, 'Low', 'IT Services'],
    ['Mock placement aptitude test this Saturday', 'Practise quantitative, logical and verbal sections in a timed environment in Computer Lab 3. Seats are limited.', 'Placement', -12, 'Medium', 'Training & Placement Cell']
  ].map((r, i) => ({ id: 'a' + i, title: r[0], desc: r[1], category: r[2], date: offISO(r[3]), priority: r[4], author: r[5] })),

  events: () => [
    ['CodeSprint 24-Hour Hackathon', 'Build a working prototype in 24 hours with a team of up to four. Mentors from industry will review projects.', 3, '09:00 AM', 'Innovation Lab, Block C', 'Technical', 'Coding Club', 120],
    ['Intro to Machine Learning Workshop', 'A hands-on session covering regression, classification and model evaluation using Python notebooks.', 5, '02:00 PM', 'Seminar Hall 2', 'Workshop', 'AI & ML Club', 60],
    ['Sunrise Photography Walk', 'Explore the campus lake and gardens with experienced photographers. Bring any camera or phone.', 2, '06:00 AM', 'Main Gate', 'Cultural', 'Photography Club', 40],
    ['Career Talk: Cracking Product Companies', 'Alumni engineers share interview strategies, resume tips and lessons from their first jobs.', 7, '04:00 PM', 'Auditorium', 'Career', 'Placement Cell', 200],
    ['Cultural Night: Rang Tarang', 'An evening of music, dance and drama performances by students from all departments.', 12, '06:30 PM', 'Open Air Theatre', 'Cultural', 'Cultural Club', 300],
    ['Robotics Demo Day', 'Watch line-follower and obstacle-avoidance robots built by students, then try the controllers yourself.', 9, '11:00 AM', 'Mechatronics Lab', 'Technical', 'Robotics Club', 80],
    ['Startup Pitch Evening', 'Student founders pitch ideas to a panel of entrepreneurs and investors. Audience votes for the best pitch.', 15, '05:00 PM', 'Seminar Hall 1', 'Career', 'Entrepreneurship Club', 100],
    ['Blood Donation Camp', 'Organised with the city blood bank. Donors receive a certificate and refreshments.', 20, '10:00 AM', 'Health Centre', 'Social', 'NSS Unit', 150],
    ['Inter-Department Sports Day', 'Cricket, football, volleyball and track events between departments. Cheer for your team.', -4, '08:00 AM', 'Sports Ground', 'Sports', 'Physical Education Dept.', 250],
    ['Open Mic Evening', 'Poetry, stand-up, music or storytelling. Sign up on the spot and perform for five minutes.', -10, '05:30 PM', 'Student Lounge', 'Cultural', 'Literary Society', 70]
  ].map((r, i) => ({ id: 'e' + i, name: r[0], desc: r[1], date: offISO(r[2]), time: r[3], location: r[4], category: r[5], organizer: r[6], seats: r[7], cap: r[7] })),

  clubs: () => [
    ['Coding Club', 'Weekly problem-solving sessions, open-source contributions and hackathon prep for all skill levels.', 'Technical', 'Dr. Meera Nair', 142, ['Weekly coding contests', 'Open-source Fridays', 'Hackathon training']],
    ['AI & ML Club', 'Learn machine learning through reading groups, Kaggle challenges and small research projects.', 'Technical', 'Prof. Rahul Verma', 98, ['Kaggle study groups', 'Paper reading circle', 'Model-building labs']],
    ['Robotics Club', 'Design, build and program robots for national competitions using Arduino and Raspberry Pi.', 'Technical', 'Dr. Suresh Babu', 76, ['Robot-building workshops', 'Inter-college contests', 'Sensor lab sessions']],
    ['Cultural Club', 'Dance, music and theatre. We organise the annual cultural fest and weekly practice sessions.', 'Cultural', 'Ms. Kavitha Rao', 187, ['Dance rehearsals', 'Drama workshops', 'Annual fest']],
    ['Photography Club', 'Photo walks, editing workshops and monthly exhibitions of student work around campus.', 'Creative', 'Mr. Imran Sheikh', 64, ['Monthly photo walks', 'Editing masterclasses', 'Campus exhibition']],
    ['Entrepreneurship Club', 'Turn ideas into ventures with mentor sessions, pitch practice and startup founder meetups.', 'Business', 'Dr. Anita Joseph', 83, ['Pitch nights', 'Founder talks', 'Business plan clinics']]
  ].map((r, i) => ({ id: 'c' + i, name: r[0], desc: r[1], category: r[2], coordinator: r[3], members: r[4], activities: r[5] })),

  campus: () => [
    ['Central Library', 'Over 60,000 books, journals, digital databases and silent study floors.', 'Academic', 'Block A, Ground Floor', 'Mon–Sat, 8:00 AM – 9:00 PM', 'library@campus.edu · 040-5550-1101'],
    ['Computer Labs', 'Six labs with high-speed internet, licensed software and lab assistants.', 'Academic', 'Block C, Floors 1–2', 'Mon–Sat, 9:00 AM – 6:00 PM', 'labs@campus.edu · 040-5550-1102'],
    ['Placement Cell', 'Resume reviews, mock interviews, aptitude training and company drives.', 'Career', 'Admin Block, Room 204', 'Mon–Fri, 10:00 AM – 5:00 PM', 'placements@campus.edu · 040-5550-1103'],
    ['Student Support Desk', 'Help with certificates, scholarships, ID cards and general queries.', 'Support', 'Admin Block, Ground Floor', 'Mon–Sat, 9:30 AM – 4:30 PM', 'support@campus.edu · 040-5550-1104'],
    ['Hostel Office', 'Room allotment, mess feedback, maintenance requests and visitor passes.', 'Support', 'Boys & Girls Hostel Blocks', 'Daily, 8:00 AM – 8:00 PM', 'hostel@campus.edu · 040-5550-1105'],
    ['Transportation Office', 'College bus routes, schedules and monthly pass issuance.', 'Support', 'Near Main Gate', 'Mon–Sat, 8:00 AM – 5:00 PM', 'transport@campus.edu · 040-5550-1106'],
    ['Central Cafeteria', 'Vegetarian and non-vegetarian meals, snacks and fresh juices at student prices.', 'Food', 'Food Court, Block D', 'Daily, 7:30 AM – 8:00 PM', 'cafeteria@campus.edu · 040-5550-1107'],
    ['Sports Complex', 'Cricket ground, basketball and badminton courts, indoor games and a gym.', 'Sports', 'South Campus', 'Daily, 6:00 AM – 8:00 PM', 'sports@campus.edu · 040-5550-1108'],
    ['Academic Departments', 'Faculty cabins and department offices for CSE, ECE, Mechanical, Civil and MBA.', 'Academic', 'Blocks A, B and C', 'Mon–Sat, 9:00 AM – 5:00 PM', 'academics@campus.edu · 040-5550-1109'],
    ['Health Centre', 'First aid, a visiting doctor and an ambulance available around the clock.', 'Support', 'Near Sports Complex', 'Daily, 9:00 AM – 6:00 PM', 'health@campus.edu · 040-5550-1110']
  ].map((r, i) => ({ id: 'r' + i, name: r[0], desc: r[1], category: r[2], location: r[3], timings: r[4], contact: r[5] })),

  study: () => [
    ['JavaScript Guide', 'Web Development', 'Complete reference and guides for JavaScript from MDN.', 'Documentation', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
    ['Modern JavaScript Tutorial', 'Web Development', 'Step-by-step tutorial from the basics to advanced topics.', 'Tutorials', 'https://javascript.info/'],
    ['CSS Flexbox Guide', 'Web Development', 'Learn Flexbox with visual, practical examples.', 'Tutorials', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/'],
    ['freeCodeCamp Curriculum', 'Web Development', 'Free certification courses in responsive design and JavaScript.', 'Practice', 'https://www.freecodecamp.org/learn'],
    ['Data Structures Notes', 'Computer Science', 'Arrays, linked lists, trees and graphs explained with examples.', 'Notes', 'https://www.geeksforgeeks.org/data-structures/'],
    ['Algorithm Visualizer', 'Computer Science', 'Watch sorting and graph algorithms run step by step.', 'Practice', 'https://visualgo.net/en'],
    ['LeetCode Practice Problems', 'Placement', 'Coding interview problems sorted by difficulty and topic.', 'Placement', 'https://leetcode.com/problemset/'],
    ['Aptitude Preparation', 'Placement', 'Quantitative, logical and verbal reasoning practice tests.', 'Placement', 'https://www.indiabix.com/'],
    ['Git Documentation', 'Tools', 'The official Git book covering workflows, branching and collaboration.', 'Documentation', 'https://git-scm.com/book/en/v2'],
    ['Database Concepts and SQL', 'Computer Science', 'Learn queries, joins and normalisation with interactive examples.', 'Tutorials', 'https://www.w3schools.com/sql/']
  ].map((r, i) => ({ id: 's' + i, title: r[0], subject: r[1], desc: r[2], type: r[3], link: r[4] })),

  lostfound: () => [
    ['Lost', 'Black leather wallet', 'Contains student ID card and some cash. Lost near the cafeteria.', 'ID & Cards', -2, 'Central Cafeteria', 'ravi.k@campus.edu', 'Open'],
    ['Found', 'Blue water bottle', 'Steel bottle with a mountain sticker, left on a library table.', 'Other', -1, 'Central Library', '040-5550-1101', 'Open'],
    ['Lost', 'Scientific calculator', 'Casio fx-991 with initials "SP" on the back.', 'Electronics', -4, 'Block B, Room 105', 'sneha.p@campus.edu', 'Open'],
    ['Found', 'Set of keys', 'Three keys on a red keychain, found near the parking area.', 'Accessories', -3, 'Main Parking', 'support@campus.edu', 'Open'],
    ['Lost', 'Data Structures textbook', 'Blue cover, name written inside the first page.', 'Books & Stationery', -6, 'Computer Lab 2', 'arjun.m@campus.edu', 'Resolved'],
    ['Found', 'Wireless earbuds', 'White charging case with earbuds, found in the auditorium.', 'Electronics', -5, 'Auditorium', 'support@campus.edu', 'Open'],
    ['Lost', 'Grey hoodie', 'Size M, left on the bleachers after the football match.', 'Clothing', -8, 'Sports Ground', 'nikhil.s@campus.edu', 'Open'],
    ['Found', 'Prescription glasses', 'Black rectangular frame in a brown case.', 'Accessories', -7, 'Block A Corridor', 'support@campus.edu', 'Resolved']
  ].map((r, i) => ({ id: 'l' + i, type: r[0], name: r[1], desc: r[2], category: r[3], date: offISO(r[4]), location: r[5], contact: r[6], status: r[7], own: false }))
};
