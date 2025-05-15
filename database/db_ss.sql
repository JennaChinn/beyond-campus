-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: db_ss
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `user_id` int NOT NULL,
  `friend_user_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`friend_user_id`),
  KEY `FK_friends_user` (`user_id`),
  KEY `FK_friends_user_2` (`friend_user_id`),
  CONSTRAINT `FK_friends_user` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_friends_user_2` FOREIGN KEY (`friend_user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
-- INSERT INTO `friends` VALUES (13,1),(22,1),(40,1),(42,2),(44,2),(45,2),(8,3),(15,3),(20,3),(3,4),(6,4),(23,4),(36,4),(43,4),(44,4),(4,5),(23,5),(36,5),(3,6),(11,6),(35,6),(37,6),(42,6),(46,7),(34,9),(43,9),(51,9),(15,10),(40,10),(41,10),(7,11),(28,11),(38,11),(42,11),(9,12),(40,12),(45,12),(7,13),(13,13),(35,13),(11,14),(30,14),(44,14),(46,14),(2,15),(21,15),(27,15),(51,15),(13,16),(18,16),(38,16),(45,16),(16,17),(18,17),(19,17),(21,18),(33,18),(44,18),(51,18),(34,19),(35,19),(36,19),(49,19),(22,20),(29,20),(40,20),(47,20),(49,20),(37,22),(8,23),(15,23),(21,23),(31,23),(36,24),(51,24),(2,25),(14,25),(41,25),(13,26),(28,26),(45,26),(2,27),(31,27),(20,28),(49,28),(13,29),(26,29),(31,29),(10,30),(22,30),(46,30),(30,31),(45,31),(7,32),(9,32),(41,32),(43,32),(39,33),(44,33),(16,34),(18,34),(36,34),(37,34),(11,35),(14,35),(20,35),(21,35),(40,35),(3,36),(18,36),(38,36),(1,37),(27,37),(40,37),(44,37),(47,37),(43,38),(25,39),(29,39),(32,39),(36,39),(23,40),(30,40),(32,40),(36,40),(35,41),(51,41),(30,42),(46,42),(47,42),(14,43),(16,43),(20,43),(42,43),(35,44),(44,44),(33,45),(22,46),(28,46),(31,46),(37,46),(28,47),(29,47),(32,47),(30,49),(32,49),(45,49),(9,50);
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
LOAD DATA INFILE '/var/lib/mysql-files/friends.csv'
  INTO TABLE friends
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\r\n'
  IGNORE 1 ROWS;
UNLOCK TABLES;

--
-- Table structure for table `hashtag`
--

DROP TABLE IF EXISTS `hashtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hashtag` (
  `tag_number` varchar(10) NOT NULL,
  `content` varchar(255) NOT NULL,
  `category_number` varchar(2) NOT NULL,
  PRIMARY KEY (`tag_number`),
  CONSTRAINT `FK_categories_number` FOREIGN KEY (category_number)
    REFERENCES `categories` (`category_number`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hashtag`
--

LOCK TABLES `hashtag` WRITE;
/*!40000 ALTER TABLE `hashtag` DISABLE KEYS */;
LOAD DATA INFILE '/var/lib/mysql-files/hashtag.csv'
  INTO TABLE hashtag
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\r\n'
  IGNORE 1 ROWS;
/*!40000 ALTER TABLE `hashtag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_number` varchar(2) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `categories` WRITE;
LOAD DATA INFILE '/var/lib/mysql-files/categories.csv'
  INTO TABLE categories
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\r\n'
  IGNORE 1 ROWS;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `bio` text CHARACTER SET utf8mb4,
  `major` varchar(255) NOT NULL,
  `year` year NOT NULL,
  `gender` enum('Male','Female','Other','Prefer not to say') NOT NULL,
  `registration_date` DATE NOT NULL DEFAULT '2025-01-01',
  `permissions` TINYINT(1) DEFAULT 0,
  `reports` int DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
LOAD DATA INFILE '/var/lib/mysql-files/user.csv'
  INTO TABLE user
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\r\n'
  IGNORE 1 ROWS;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `block`
--

DROP TABLE IF EXISTS `block`;
CREATE TABLE `block` (
  `user_blocker` int NOT NULL,
  `user_blocked` int NOT NULL,
  PRIMARY KEY (`user_blocker`,`user_blocked`),
  KEY `FK_blocker` (`user_blocker`),
  KEY `FK_blocked` (`user_blocked`),
  CONSTRAINT `FK_blocker` FOREIGN KEY (`user_blocker`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_blocked` FOREIGN KEY (`user_blocked`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
CREATE TABLE `report` (
  `user_reporter` int NOT NULL,
  `user_reported` int NOT NULL,
  `message` text CHARACTER SET utf8mb4,
  `notes` text CHARACTER SET utf8mb4,
  `report_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`report_id`),
  KEY `FK_reporter` (`user_reporter`),
  KEY `FK_reported` (`user_reported`),
  CONSTRAINT `FK_reporter` FOREIGN KEY (`user_reporter`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_reported` FOREIGN KEY (`user_reported`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `friendrequest`
--
DROP TABLE IF EXISTS `friendrequest`;
CREATE TABLE  `friendrequest` (
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  PRIMARY KEY (`sender`,`receiver`),
  KEY `FK_sender` (`sender`),
  KEY `FK_receiver` (`receiver`),
  CONSTRAINT `FK_sender` FOREIGN KEY (`sender`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_receiver` FOREIGN KEY (`receiver`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `userhashtag`
--

DROP TABLE IF EXISTS `userhashtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userhashtag` (
  `user_id` int NOT NULL,
  `tag_number` varchar(10) NOT NULL,
  PRIMARY KEY (`user_id`,`tag_number`),
  KEY `FK_userhashtag_hashtag` (`tag_number`),
  CONSTRAINT `FK_userhashtag_hashtag` FOREIGN KEY (`tag_number`)
    REFERENCES `hashtag` (`tag_number`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_userhashtag_user` FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userhashtag`
--

LOCK TABLES `userhashtag` WRITE;
LOAD DATA INFILE '/var/lib/mysql-files/test-tag.csv'
  INTO TABLE userhashtag
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\r\n'
  IGNORE 1 ROWS;
/*!40000 ALTER TABLE `userhashtag` DISABLE KEYS */;
-- INSERT INTO `userhashtag` VALUES (1,'0001'),(15,'0001'),(24,'0001'),(34,'0001'),(44,'0001'),(51,'0001'),(4,'0002'),(10,'0002'),(42,'0002'),(46,'0002'),(52,'0002'),(24,'0003'),(25,'0003'),(31,'0003'),(32,'0003'),(44,'0003'),(25,'0004'),(29,'0004'),(30,'0004'),(45,'0004'),(48,'0004'),(8,'0101'),(14,'0101'),(15,'0101'),(17,'0101'),(46,'0101'),(5,'0102'),(26,'0102'),(30,'0102'),(32,'0102'),(9,'0103'),(16,'0103'),(22,'0103'),(35,'0103'),(41,'0103'),(23,'0104'),(34,'0104'),(35,'0104'),(52,'0104'),(10,'0105'),(11,'0105'),(12,'0105'),(18,'0105'),(20,'0105'),(17,'0106'),(31,'0106'),(33,'0106'),(45,'0106'),(48,'0106'),(11,'0107'),(13,'0107'),(14,'0107'),(23,'0107'),(37,'0107'),(1,'0108'),(32,'0108'),(37,'0108'),(45,'0108'),(48,'0108'),(2,'0109'),(8,'0109'),(11,'0109'),(15,'0109'),(25,'0109'),(1,'0110'),(4,'0110'),(15,'0110'),(50,'0110'),(9,'0111'),(23,'0111'),(36,'0111'),(41,'0111'),(47,'0111'),(25,'0112'),(27,'0112'),(30,'0112'),(38,'0112'),(41,'0112'),(51,'0112'),(4,'0113'),(9,'0113'),(11,'0113'),(36,'0113'),(49,'0113'),(6,'0114'),(21,'0114'),(27,'0114'),(35,'0114'),(44,'0114'),(9,'0115'),(15,'0115'),(20,'0115'),(27,'0115'),(48,'0115'),(7,'0116'),(25,'0116'),(28,'0116'),(39,'0116'),(50,'0116'),(10,'0201'),(17,'0201'),(34,'0201'),(38,'0201'),(42,'0201'),(1,'0202'),(7,'0202'),(17,'0202'),(24,'0202'),(46,'0202'),(18,'0203'),(19,'0203'),(30,'0203'),(41,'0203'),(49,'0203'),(4,'0204'),(12,'0204'),(35,'0204'),(39,'0204'),(44,'0204'),(51,'0204'),(52,'0204'),(11,'0205'),(21,'0205'),(33,'0205'),(49,'0205'),(3,'0206'),(14,'0206'),(33,'0206'),(50,'0206'),(17,'0207'),(37,'0207'),(40,'0207'),(45,'0207'),(18,'0208'),(22,'0208'),(46,'0208'),(3,'0301'),(6,'0301'),(37,'0301'),(42,'0301'),(4,'0302'),(5,'0302'),(40,'0302'),(44,'0302'),(15,'0303'),(26,'0303'),(32,'0303'),(42,'0303'),(2,'0304'),(27,'0304'),(46,'0304'),(50,'0304'),(22,'0305'),(35,'0305'),(43,'0305'),(48,'0305'),(4,'0306'),(30,'0306'),(34,'0306'),(35,'0306'),(52,'0306'),(2,'0307'),(13,'0307'),(23,'0307'),(40,'0307'),(25,'0401'),(39,'0401'),(40,'0401'),(48,'0401'),(13,'0402'),(21,'0402'),(36,'0402'),(39,'0402'),(9,'0403'),(19,'0403'),(39,'0403'),(40,'0403'),(12,'0404'),(13,'0404'),(26,'0404'),(35,'0404'),(2,'0405'),(24,'0405'),(28,'0405'),(42,'0405'),(3,'0406'),(5,'0406'),(12,'0406'),(18,'0406'),(28,'0407'),(36,'0407'),(39,'0407'),(49,'0407'),(2,'0408'),(13,'0408'),(33,'0408'),(36,'0408'),(11,'0409'),(15,'0409'),(31,'0409'),(34,'0409'),(10,'0410'),(12,'0410'),(18,'0410'),(47,'0410'),(4,'0501'),(40,'0501'),(41,'0501'),(49,'0501'),(14,'0502'),(18,'0502'),(39,'0502'),(43,'0502'),(9,'0503'),(12,'0503'),(23,'0503'),(40,'0503'),(4,'0504'),(11,'0504'),(17,'0504'),(33,'0504'),(3,'0505'),(27,'0505'),(37,'0505'),(43,'0505'),(24,'0506'),(25,'0506'),(27,'0506'),(32,'0506'),(10,'0507'),(11,'0507'),(31,'0507'),(35,'0507'),(9,'0508'),(19,'0508'),(32,'0508'),(37,'0508'),(1,'0509'),(12,'0509'),(15,'0509'),(34,'0509'),(1,'0510'),(2,'0510'),(11,'0510'),(15,'0510'),(8,'0511'),(13,'0511'),(21,'0511'),(40,'0511'),(13,'0512'),(19,'0512'),(43,'0512'),(17,'0601'),(18,'0601'),(34,'0601'),(50,'0601'),(18,'0602'),(22,'0602'),(39,'0602'),(45,'0602'),(15,'0603'),(22,'0603'),(26,'0603'),(39,'0603'),(13,'0604'),(32,'0604'),(42,'0604'),(46,'0604'),(9,'0605'),(17,'0605'),(41,'0605'),(43,'0605'),(2,'0606'),(9,'0606'),(14,'0606'),(37,'0606'),(29,'0701'),(30,'0701'),(31,'0701'),(39,'0701'),(1,'0702'),(8,'0702'),(19,'0702'),(35,'0702'),(1,'0703'),(3,'0703'),(30,'0703'),(42,'0703'),(24,'0704'),(26,'0704'),(28,'0704'),(44,'0704'),(7,'0705'),(10,'0705'),(42,'0705'),(49,'0705'),(6,'0706'),(24,'0706'),(43,'0706'),(2,'0707'),(7,'0707'),(18,'0707'),(22,'0707'),(7,'0708'),(8,'0708'),(35,'0708'),(37,'0708'),(24,'0709'),(30,'0709'),(31,'0709'),(42,'0709'),(11,'0710'),(19,'0710'),(31,'0710'),(32,'0710'),(1,'0711'),(13,'0711'),(19,'0711'),(21,'0711'),(2,'0712'),(26,'0712'),(42,'0712'),(48,'0712'),(6,'0713'),(8,'0713'),(14,'0713'),(47,'0713'),(4,'0714'),(11,'0714'),(21,'0714'),(36,'0714'),(8,'0715'),(26,'0715'),(32,'0715'),(47,'0715'),(9,'0801'),(12,'0801'),(23,'0801'),(34,'0801'),(6,'0802'),(8,'0802'),(33,'0802'),(50,'0802'),(6,'0803'),(37,'0803'),(43,'0803'),(47,'0803'),(7,'0804'),(8,'0804'),(20,'0804'),(34,'0804'),(2,'0805'),(46,'0805'),(48,'0805'),(8,'0806'),(21,'0806'),(24,'0806'),(38,'0806'),(3,'0807'),(6,'0807'),(12,'0807'),(15,'0807'),(26,'0808'),(33,'0808'),(37,'0808'),(47,'0808'),(26,'0809'),(34,'0809'),(35,'0809'),(48,'0809'),(9,'0901'),(29,'0901'),(39,'0901'),(44,'0901'),(5,'0902'),(17,'0902'),(22,'0902'),(35,'0902'),(16,'0903'),(19,'0903'),(20,'0903'),(29,'0903'),(14,'0904'),(31,'0904'),(49,'0904'),(24,'0905'),(26,'0905'),(44,'0905'),(5,'0906'),(10,'0906'),(19,'0906'),(26,'0906'),(3,'0907'),(12,'0907'),(17,'0907'),(40,'0907');
/*!40000 ALTER TABLE `userhashtag` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-07  0:45:42

--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklist` (
  `user_id` int NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `messages`;
CREATE TABLE  `messages` (
  `user_from` int NOT NULL,
  `user_to` int NOT NULL,
  `sent` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `body` TEXT NOT NULL,
  KEY `FK_messages_user_from` (`user_from`),
  KEY `FK_messages_user_to` (`user_to`),
  CONSTRAINT `FK_messages_user_from` FOREIGN KEY (`user_from`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_messages_user_to` FOREIGN KEY (`user_to`)
    REFERENCES `user` (`user_id`)
    ON DELETE CASCADE
);