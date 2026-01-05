use movies_explore_db;

INSERT INTO genres (id, type) VALUES
(1, 'Action'), (2, 'Adventure'), (3, 'Fantasy'), (4, 'Science Fiction'), (5, 'Crime'), (6, 'Drama'), (7, 'Thriller'), (8, 'Animation'), (9, 'Family'), (10, 'Romance'), (11, 'Comedy'), (12, 'Horror'), (13, 'Mystery'), (14, 'Western'), (15, 'War');

INSERT INTO directors (id, first_name, last_name, age, image_url) VALUES
(1, 'James', 'Cameron', 71, NULL),
(2, 'Richard', 'Marquand', 58, NULL),
(3, 'Sam', 'Mendes', 60, NULL),
(4, 'Christopher', 'Nolan', 55, NULL),
(5, 'Andrew', 'Stanton', 59, NULL),
(6, 'Sam', 'Raimi', 65, NULL),
(7, 'Nathan', 'Greno', 52, NULL),
(8, 'Joss', 'Whedon', 61, NULL),
(9, 'David', 'Yates', 62, NULL),
(10, 'Zack', 'Snyder', 59, NULL),
(11, 'Bryan', 'Singer', 59, NULL),
(12, 'Bryan', 'Singer', 59, NULL),
(13, 'F. Gary', 'Gray', 55, NULL),
(14, 'Jon', 'Favreau', 59, NULL),
(15, 'James', 'Mangold', 61, NULL);

-- 3. Actors (with random ages)
INSERT INTO actors (id, first_name, last_name, age, image_url) VALUES
(1, 'Sam', 'Worthington', 48, NULL),
(2, 'Zoe', 'Saldana', 47, NULL),
(3, 'Johnny', 'Depp', 61, NULL),
(4, 'Helena', 'Bonham Carter', 59, NULL),
(5, 'Aaron', 'Taylor-Johnson', 34, NULL),
(6, 'Cillian', 'Murphy', 48, NULL),
(7, 'Tom', 'Cruise', 63, NULL),
(8, 'Chris', 'Hemsworth', 42, NULL),
(9, 'Mahershala', 'Ali', 51, NULL),
(10, 'Scarlett', 'Johansson', 40, NULL),
(11, 'Rami', 'Malek', 44, NULL),
(12, 'Vin', 'Diesel', 58, NULL),
(13, 'Henry', 'Cavill', 42, NULL),
(14, 'Keanu', 'Reeves', 61, NULL),
(15, 'Bruce', 'Willis', 71, NULL);

-- 4. Movies (first 20 from CSV)
INSERT INTO movies (id, title, description, release_year, image_url, director_id, rating) VALUES
(1, 'Avatar', 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.', 2009, NULL, 1, 72),
(2, 'Pirates of the Caribbean: At Worlds End', 'Captain Barbossa, long believed to be dead, has come back to life and is headed to the edge of the Earth with Will Turner and Elizabeth Swann.', 2007, NULL, 2, 69),
(3, 'Spectre', 'A cryptic message from Bonds past sends him on a trail to uncover a sinister organization.', 2015, NULL, 3, 63),
(4, 'The Dark Knight Rises', 'Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dents crimes to protect the late attorneys reputation.', 2012, NULL, 4, 77),
(5, 'John Carter', 'John Carter is a war-weary, former military captain whos inexplicably transported to the mysterious and exotic planet of Barsoom (Mars) and reluctantly becomes embroiled in an epic conflict.', 2012, NULL, 5, 61),
(6, 'Spider-Man 3', 'The seemingly invincible Spider-Man goes up against an all-new crop of villains including the shape-shifting Sandman.', 2007, NULL, 6, 59),
(7, 'Tangled', 'When the kingdoms most wanted-and most charming-bandit Flynn Rider hides out in a mysterious tower, hes taken hostage by Rapunzel.', 2010, NULL, 7, 74),
(8, 'Avengers: Age of Ultron', 'When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and Earths Mightiest Heroes are put to the ultimate test.', 2015, NULL, 8, 73),
(9, 'Harry Potter and the Half-Blood Prince', 'As Harry begins his sixth year at Hogwarts, he discovers an old book marked as Property of the Half-Blood Prince.', 2009, NULL, 9, 75),
(10, 'Batman v Superman: Dawn of Justice', 'Fearing the actions of a god-like Super Hero left unchecked, Gotham Citys own formidable, forceful vigilante takes on Metropoliss most revered, modern-day savior.', 2016, NULL, 10, 57),
(11, 'Bohemian Rhapsody', 'Singer Freddie Mercury gains fame as a British rock star leading Queen.', 2018, NULL, 11, 80),
(12, 'X-Men: Apocalypse', 'After the re-emergence of the worlds first mutant, world-dominating Apocalypse, Professor X and his X-Men team must unite to defeat his extinction-level plan.', 2016, NULL, 12, 64),
(13, 'The Fate of the Furious', 'When a mysterious woman seduces Dom into the world of terrorism and a betrayal of those closest to him.', 2017, NULL, 13, 67),
(14, 'The Lion King', 'Simba idolizes his father, King Mufasa, until his uncle Scar murders Mufasa in a plot to seize the throne.', 2019, NULL, 14, 73),
(15, 'Logan', 'In the near future, a weary Logan cares for an ailing Professor X, somewhere on the Mexican border.', 2017, NULL, 15, 78),
(16, 'Pirates of the Caribbean: Dead Mans Chest', 'Captain Jack Sparrow works his way out of a blood debt with the ghostly Davey Jones.', 2006, NULL, 2, 71),
(17, 'The Lone Ranger', 'The Texas Rangers chase down a gang of outlaws led by Butch Cavendish.', 2013, NULL, 2, 59),
(18, 'Man of Steel', 'A young boy learns that he has extraordinary powers and is not of this earth.', 2013, NULL, 10, 66),
(19, 'The Chronicles of Narnia: Prince Caspian', 'One year after their incredible adventures in The Lion, the Witch and the Wardrobe.', 2008, NULL, 2, 63),
(20, 'The Avengers', 'When an unexpected enemy emerges and threatens global safety and security, Nick Fury finds himself in need of a team.', 2012, NULL, 8, 75);

-- 5. Movie-Genre links (parsed from genres JSON field)
INSERT INTO movie_genre (movie_id, genre_id) VALUES
(1,1),(1,2),(1,3),(1,4), (2,2),(2,3),(2,1), (3,1),(3,2),(3,5), (4,1),(4,2),(4,5), (5,2),(5,3),(5,4),
(6,3),(6,1), (7,8),(7,9), (8,1),(8,2),(8,4), (9,2),(9,3), (10,1),(10,2),(10,3),(10,4),
(11,6),(11,10),(11,11), (12,1),(12,4),(12,12), (13,1),(13,2),(13,5),(13,7), (14,2),(14,3),(14,9),
(15,1),(15,6),(15,13), (16,2),(16,3),(16,1),(16,4), (17,1),(17,2),(17,14), (18,2),(18,3),(18,4),
(19,2),(19,1),(19,4), (20,2),(20,1),(20,4),(20,7);

-- 6. Movie-Actor links (sample top actors per movie)
INSERT INTO movie_actor (movie_id, actor_id) VALUES
(1,1),(1,2), (2,3),(2,4), (3,7),(3,5), (4,6),(4,10), (5,1),(5,7), (6,7),(6,10),
(7,8),(7,9), (8,8),(8,10), (9,10),(9,9), (10,13),(10,6), (11,11),(11,12), (12,12),(12,13),
(13,12),(13,14), (14,14),(14,15), (15,15),(15,13), (16,3),(16,4), (17,3),(17,5), (18,13),(18,10),
(19,10),(19,9), (20,8),(20,10);

-- 7. Reviews (dummy, 1 per movie for brevity)
INSERT INTO reviews (id, movie_id, reviewer_name, rating, comment, created_at) VALUES
(100,1,'User1','8.0','Epic visuals and world-building.','2020-01-01 00:00:00'),
(101,2,'User2','7.5','Fun pirate adventure sequel.','2020-01-02 00:00:00'),
(102,3,'User3','7.0','Solid Bond entry with great action.','2020-01-03 00:00:00'),
(103,4,'User4','8.5','Nolan masterpiece conclusion.','2020-01-04 00:00:00'),
(104,5,'User5','6.5','Ambitious but flawed.','2020-01-05 00:00:00'),
(105,6,'User6','6.0','Overstuffed but entertaining.','2020-01-06 00:00:00'),
(106,7,'User7','8.0','Beautiful Disney animation.','2020-01-07 00:00:00'),
(107,8,'User8','7.5','Great team-up spectacle.','2020-01-08 00:00:00'),
(108,9,'User9','7.5','Dark Harry Potter entry.','2020-01-09 00:00:00'),
(109,10,'User10','6.0','Divisive DC film.','2020-01-10 00:00:00'),
(110,11,'User11','8.5','Rami steals the show.','2020-01-11 00:00:00'),
(111,12,'User12','6.5','Fun X-Men chaos.','2020-01-12 00:00:00'),
(112,13,'User13','7.0','Fast and Furious fun.','2020-01-13 00:00:00'),
(113,14,'User14','8.0','Emotional remake.','2020-01-14 00:00:00'),
(114,15,'User15','8.5','Perfect send-off.','2020-01-15 00:00:00'),
(115,16,'User16','7.5','Creepy pirate sequel.','2020-01-16 00:00:00'),
(116,17,'User17','6.0','Mixed Lone Ranger.','2020-01-17 00:00:00'),
(117,18,'User18','6.5','Superman reboot.','2020-01-18 00:00:00'),
(118,19,'User19','6.5','Narnia sequel.','2020-01-19 00:00:00'),
(119,20,'User20','8.0','Avengers debut.','2020-01-20 00:00:00');