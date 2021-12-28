# Mern stack

MongoDB -> Mysql 로 변경한 Mern stack 사용(프로토 타이핑은 이 스택을 사용하고 major 프로젝트로 승격되면 spring boot + mysql 로 변경)

![image](https://user-images.githubusercontent.com/54349213/128986236-eabcd22b-62d3-410e-ae1f-d68697e67811.png)

https://www.mongodb.com/mern-stack

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/leejaehee1/nodejs.git # or clone your own fork
$ cd nodejs
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Github

```
$ git remote
heroku
origin
origin2
$ git push -u origin2 main
```
or

## Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## create sql 쿼리

CREATE DATABASE test DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'

## data sql 쿼리

-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--

-- Host: localhost    Database: punch

-- ------------------------------------------------------

-- Server version	8.0.26

--

-- Current Database: `punch`
--

DROP DATABASE  `punch`  ;

CREATE DATABASE  `punch`  ;

USE `punch`;

--

-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
CREATE TABLE `area` (
  `area` char(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `areaName` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`area`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `area`
--

LOCK TABLES `area` WRITE;
INSERT INTO `area` VALUES ('UTIL4','Utility 4th Floor'),('C4BL','10th Floor');
UNLOCK TABLES;

--

-- Table structure for table `authority`
--

DROP TABLE IF EXISTS `authority`;
CREATE TABLE `authority` (
  `authority` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authName` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`authority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `authority`
--

LOCK TABLES `authority` WRITE;
INSERT INTO `authority` VALUES ('1','Assignee','시공담당자'),('2','Quality Staff','품질담당자'),('3','Quality Manager','품질관리자'),('4','QC','외부 품질검사원'),('5','Admin','시스템관리자');
UNLOCK TABLES;

--

-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stage` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
INSERT INTO `category` VALUES ('A','Complete before Pressure Test',''),('B','Complete before Pre-commissioning',''),('C','Complete before Commissioning',''),('D','Complete during Commissioning and Start-up','');
UNLOCK TABLES;

--

-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `department` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deptName` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shortName` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
INSERT INTO `department` VALUES ('123','품질관리팀','품질'),('456','시공관리팀','시공'),('789','사업관리팀','사업');
UNLOCK TABLES;

--

-- Table structure for table `discipline`
--

DROP TABLE IF EXISTS `discipline`;
CREATE TABLE `discipline` (
  `discipline` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `disciplineName` varchar(24) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shortName` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`discipline`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `discipline`
--

LOCK TABLES `discipline` WRITE;
INSERT INTO `discipline` VALUES ('1','Piping','Piping'),('2','Mechanical','Mech'),('3','Electric','Elec'),('4','Instrument','Inst'),('5','Civil','Civil'),('6','Architecture','Arch'),('7','Structure','Struc');
UNLOCK TABLES;

--

-- Table structure for table `drawing`
--

DROP TABLE IF EXISTS `drawing`;
CREATE TABLE `drawing` (
  `projectID` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `systemID` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subsystem` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seq` tinyint NOT NULL,
  `drawingNo` char(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploadDate` datetime DEFAULT NULL,
  `imagePath` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `xSize` int DEFAULT NULL,
  `ySize` int DEFAULT NULL,
  PRIMARY KEY (`projectID`,`systemID`,`subsystem`,`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `drawing`
--

LOCK TABLES `drawing` WRITE;
UNLOCK TABLES;

--

-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
CREATE TABLE `photos` (
  `punchID` char(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `punchStep` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seq` tinyint NOT NULL,
  `localPath` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagePath` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploadDate` datetime DEFAULT NULL,
  PRIMARY KEY (`punchID`,`punchStep`,`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
UNLOCK TABLES;

--

-- Table structure for table `progress`
--

DROP TABLE IF EXISTS `progress`;
CREATE TABLE `progress` (
  `projectID` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `predDate` datetime NOT NULL,
  `trend` tinyint DEFAULT NULL,
  `predict` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`projectID`,`predDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `progress`
--

LOCK TABLES `progress` WRITE;
UNLOCK TABLES;

--

-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `projectID` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectName` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `activated` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`projectID`,`projectName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
INSERT INTO `project` VALUES ('A12','Algeria RDPP','2021-09-10 00:00:00',null,'1'),('B10','Algeria RDPP-1','2021-07-10 00:00:00',null,'0');
UNLOCK TABLES;

--

-- Table structure for table `projectuser`
--

DROP TABLE IF EXISTS `projectuser`;
CREATE TABLE `projectuser` (
  `projectID` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userID` char(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`projectID`,`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `projectuser`
--

LOCK TABLES `projectuser` WRITE;
INSERT INTO `projectuser` VALUES ('A12','user1'),('A12','user2'),('B10','user3');
UNLOCK TABLES;

--

-- Table structure for table `punchlist`
--

DROP TABLE IF EXISTS `punchlist`;
CREATE TABLE `punchlist` (
  `projectID` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `punchID` char(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `systemID` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subsystem` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discipline` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tagNumber` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bulkItem` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bulkName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetDate` datetime DEFAULT NULL,
  `issuedDate` datetime DEFAULT NULL,
  `issuedBy` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `raisedBy` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completedDate` datetime DEFAULT NULL,
  `completedBy` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `confirmedDate` datetime DEFAULT NULL,
  `confirmedBy` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notAcceptedDate` datetime DEFAULT NULL,
  `notAcceptedBy` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closedDate` datetime DEFAULT NULL,
  `closedBy` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduleKey` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheStartDate` datetime DEFAULT NULL,
  `scheFinishDate` datetime DEFAULT NULL,
  `designChgReq` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `materialReq` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issueDescription` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completeComment` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notAcceptComment` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` tinyint DEFAULT NULL,
  `scheduleImpact` tinyint DEFAULT NULL,
  `costImpact` tinyint DEFAULT NULL,
  `keyword1` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keyword2` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keyword3` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keyword4` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `drawingNo` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `awpCode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom1` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom2` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom3` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom4` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom5` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`projectID`,`punchID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `punchlist`
--

LOCK TABLES `punchlist` WRITE;
INSERT INTO `punchlist` (projectID, punchID, category, systemID, subsystem, discipline, status, unit, area, tagNumber, bulkItem, bulkName, department, targetDate, issuedDate, issuedBy, raisedBy, completedDate, completedBy, confirmedDate, confirmedBy, notAcceptedDate, notAcceptedBy, closedDate, closedBy, scheduleKey, scheStartDate, scheFinishDate, designChgReq, materialReq, issueDescription, completeComment, notAcceptComment, difficulty, scheduleImpact, costImpact, keyword1, keyword2, keyword3, keyword4, drawingNo, awpCode, custom1, custom2, custom3, custom4, custom5)
VALUES ('A12','PC-2-00-MB-MBP-E-01-001','B','UA','UEN','1','1','10','UTIL4','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3','2021-09-14 00:00:00','user3','2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',2,3,2,'Touch-up Paint','Design','Valve Tag',null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-002','A','UB','UEN','2','2','10','UTIL4','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3','2021-09-14 00:00:00','user3','2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',3,2,4,'Touch-up Paint','Design','Valve Tag',null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-003','C','UC','UEN','3','3','10','UTIL4','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3',null,null,'2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','1','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',5,1,2,'Touch-up Paint','Design','Valve Tag',null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-004','D','UE','UEN','4','4','20','UTIL4','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3',null,null,'2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',3,5,1,'Touch-up Paint','Design','Valve Tag',null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-005','A','UG','UEN','5','5','20','C4BL','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3',null,null,'2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',3,2,4,'Touch-up Paint','Material','Valve Tag',null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-006','B','UH','UEN','6','1','20','C4BL','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3',null,null,'2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','1','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',2,3,1,'Touch-up Paint','Material','Valve Tag',null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-007','C','UI','UEN','7','2','20','C4BL','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3',null,null,'2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','1','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',2,3,5,'Touch-up Paint','Material','Valve Tag',null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-008','D','UK','UEN','6','3','30','C4BL','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3',null,null,'2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',1,3,1,'Touch-up Paint','Material',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-009','D','UL','UEN','5','4','30','C4BL','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user3',null,null,'2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','1','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',5,4,1,'Touch-up Paint','Design',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-010','C','UM','UEN','4','5','30','UTIL4','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,null,null,'A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',2,3,1,'Touch-up Paint','Material',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-011','B','UP','UEN','3','2','30','C4BL','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,null,null,'A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','1','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',4,5,2,'Touch-up Paint','Material',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-012','B','UQ','UEN','2','3','10','UTIL4','26-PIT-201','0','AS','456','2021-11-01 00:00:00','2021-08-01 00:00:00','user2','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,null,null,'A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','1','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',3,2,3,'Touch-up Paint','Material',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-013','A','UT','UEN','1','1','10','C4BL','26-PIT-201','0','AS','456','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,null,null,'A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',4,4,4,'General Cleaning','Valve Tag',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-014','C','UX','UEN','2','4','30','UTIL4','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user3','user2','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,'2021-09-15 00:00:00','user3','A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',3,2,5,'General Cleaning','Valve Tag',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-015','D','UY','UEN','3','5','40','C4BL','26-PIT-201','0','AS','456','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user3','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,null,null,'A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','1','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',4,2,5,'General Cleaning','Valve Tag',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-016','D','UZ','UEN','4','5','40','UTIL4','26-PIT-201','0','AS','456','2021-11-01 00:00:00','2021-08-01 00:00:00','user1','user3','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,'2021-09-15 00:00:00','user2','A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',2,2,2,'General Cleaning','Valve Tag',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-017','B','UA','UEN','7','6','50','UTIL4','26-PIT-201','0','AS','456','2021-11-01 00:00:00','2021-08-01 00:00:00','user2','user3','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,null,null,'A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','1','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',1,4,3,'General Cleaning','Design',null,null,null,null,null,null,null,null,null),('A12','PC-2-00-MB-MBP-E-01-018','A','UE','UEN','6','6','50','UTIL4','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user2','user3','2021-09-01 00:00:00','user3','2021-09-10 00:00:00',null,null,null,null,null,'A','2021-09-20 00:00:00','2021-11-20 00:00:00','0','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',3,2,4,'General Cleaning','Design',null,null,null,null,null,null,null,null,null),('B10','PC-2-00-MB-MBP-A-01-010','C','UG','UEN','4','6','50','C4BL','26-PIT-201','0','AS','123','2021-11-01 00:00:00','2021-08-01 00:00:00','user3','user3','2021-09-01 00:00:00','user3','2021-09-10 00:00:00','user2',null,null,'2021-09-15 00:00:00','user2','A','2021-09-20 00:00:00','2021-11-20 00:00:00','1','0','Vanne (00MBQ1AA004) caoutchou de vanlant endommagé Valve (00MBQ1AA004) handle rubber damaged','Loose valve tightening is expected to cause errors in machine operation.','Loose valve tightening is expected to cause errors in machine operation.',2,4,3,'General Cleaning','Design',null,null,null,null,null,null,null,null,null);
UNLOCK TABLES;

--

-- Table structure for table `punchlistlog`
--

DROP TABLE IF EXISTS `punchlistlog`;
CREATE TABLE `punchlistlog` (
  `systemDate` datetime NOT NULL,
  `updateStatus` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `projectID` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `punchID` char(24) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `systemID` char(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subsystem` char(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discipline` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tagNumber` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bulkItem` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bulkName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetDate` datetime DEFAULT NULL,
  `issuedDate` datetime DEFAULT NULL,
  `issuedBy` char(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `raisedBy` char(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completedDate` datetime DEFAULT NULL,
  `completedBy` char(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `confirmedDate` datetime DEFAULT NULL,
  `confirmedBy` char(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closedDate` datetime DEFAULT NULL,
  `closedBy` char(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduleKey` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheStartDate` datetime DEFAULT NULL,
  `scheFinishDate` datetime DEFAULT NULL,
  `designChgReq` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `materialReq` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issueDescription` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completeComment` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notAcceptComment` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `difficulty` tinyint DEFAULT NULL,
  `scheduleImpact` tinyint DEFAULT NULL,
  `costImpact` tinyint DEFAULT NULL,
  `keyword1` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keyword2` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keyword3` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `keyword4` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `drawingNo` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `awpCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom1` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom2` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom3` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom4` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom5` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`systemDate`,`updateStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `punchlistlog`
--

LOCK TABLES `punchlistlog` WRITE;
UNLOCK TABLES;

--

-- Table structure for table `punchloc`
--

DROP TABLE IF EXISTS `punchloc`;
CREATE TABLE `punchloc` (
  `drawingNo` char(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `punchID` char(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `xPixel` int DEFAULT NULL,
  `yPixel` int DEFAULT NULL,
  PRIMARY KEY (`drawingNo`,`punchID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `punchloc`
--

LOCK TABLES `punchloc` WRITE;
UNLOCK TABLES;

--

-- Table structure for table `scheduledate`
--

DROP TABLE IF EXISTS `scheduledate`;
CREATE TABLE `scheduledate` (
  `keyID` char(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `finishDate` datetime DEFAULT NULL,
  PRIMARY KEY (`keyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `scheduledate`
--

LOCK TABLES `scheduledate` WRITE;
INSERT INTO `scheduledate` VALUES ('A','2021-09-20 00:00:00','2021-11-20 00:00:00');
UNLOCK TABLES;

--

-- Table structure for table `stage`
--

DROP TABLE IF EXISTS `stage`;
CREATE TABLE `stage` (
  `stage` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stageName` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`stage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `stage`
--

LOCK TABLES `stage` WRITE;
INSERT INTO `stage` VALUES ('1','시공'),('2','시운전'),('3','준공');
UNLOCK TABLES;

--

-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `status` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statusName` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shortName` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authority` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
INSERT INTO `status` VALUES ('1','Draft','','2','임시저장'),('2','Opened','Open','2','Punch가 처음 Issue 되어 Open 된 상태'),('3','Ready for Review','Req for Close','1','시공에서 보완작업을 마치고 QC에 검사 요청한 상태'),('4','Requested for Close','Req for Close','4','QC가 발주처 담당자와 검사를 진행하여 완성이 확인된 상태'),('5','Not Accepted','Open','3','최종검사결과 보완이 요구된 상태'),('6','Closed','Close','3',' Punch 보완이 최종 완결 된 상태');
UNLOCK TABLES;

--

-- Table structure for table `subsystem`
--

DROP TABLE IF EXISTS `subsystem`;
CREATE TABLE `subsystem` (
  `subsystem` char(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subsystemName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`subsystem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `subsystem`
--

LOCK TABLES `subsystem` WRITE;
INSERT INTO `subsystem` VALUES ('UAH','Out going gantry with beam (Portiques lignes H.T)'),('UBB','PCC for GT & ST electrical loads (poste de contr?le de puissance pour turbine ? gaz et ? vapeur)'),('UBG','Transformer area(Zone de transformateur)'),('UEH','Diesel oil unloading bay (Zone de d?potage )'),('UEL','Diesel oil pump house(unloading) B?timent pompage combustible gasoil(D?chargerment)'),('UEM-1','Fuel storage tank(R?servoir de stockage gasoil)'),('UEM-2','\"Fire water storage tanks (Destockage de l\'eau anti-incendie)\"'),('UEM-3','\"Demineralized water storage tank (R?servoir utilis?s pour stockage de l\'eau du d?min?ralis?e)\"'),('UEM-4','Potable water tank(Reservoir d\'eau potable)'),('UEM-5','Service water pump Pompe d\'eau industrielle'),('UEM-6','Day oil tank for aux. boiler Reservoir gasoil iouranalier pour chaudiere auxiliaire.'),('UEM-7','GT false start fuel oil collecting tank R?servoir collecteur de gasoil de faux d?part de ta'),('UEM-8','GT Ignition tank(Reservoir de d\'allumage de turbine a gaz)'),('UEM-9','Desalinated water storage tank (R?servoir de stock?ge de l\'eau dessal?e)'),('UEN','Gas Bottle Storage Building (Local de Stockage de Bouteilles de Gaz)'),('UGB','Electrochlorination Plant (Station d\'?lectrochloration)'),('UGD','Demineralization Building (B?timent de D?min?ralisation)'),('UGF','Fire water filling pumps (Pompes de remplissage d\'eau d\'incendie)'),('UGH-1','Piping works : Sewage; rainwater;fire water;portable water'),('UGH-2','Storm water drainage and manhole'),('UHA-1','Heat recovery steam generator(chaudiere de r?cup?ration)'),('UHA-2','HRSG sump pit & blowdown tank (puisard de la chaudi?re de r?cup?ration et r?servoir de purge) '),('UHY-1','Pipe Rack in the west side of main plant foudnation'),('UHY-2','Pipe Rack in the main plant area foudnation'),('UHY-3','Pipe rack between HRSG and Turbine building '),('UHY-4','Pipe rack in turbine building #1;#2;#3 area foundation'),('UHY-5','Cable rack in turbine building #1;#2;#3 area foundation'),('UHY-6','Pipe rack in diesel tank area foundation'),('UHY-7','Pipe rack in natural gas supply station area foundation'),('UHY-8','Sleeper-(SL & CSL)'),('ULA','HRSG Feed Pump Building (Pompes Alimentaires)'),('ULX','Local Dosing Phosphate Building (Local de Dosage en Phosphate)'),('UMC','Turbine Building (Salles des Machines)'),('UPN-1','C.W.System Intake Head'),('UPN-2','Offshore intake pipe line'),('UQA','Cooling Water Pump Station '),('UQN-1','C.W.System Discharge Channel'),('UQN-2','C.W.System Discharge Outfall'),('URD','Cooling Water Pump Station Control Building (B?timent de Contr?le de la Station de Pompage)'),('USG','Fire Fighting Pump House (Local des Pompes Incendie)'),('USR-1','Sewage treatment plant (Station d\'?puration)'),('USR-2','Waste water treatment plant (Station de traitement des eaux de reject)'),('USR-3','Fire water & oil recovery pit  of FO Storage Tank Area (Fosse de r?cup?ration des hydrocarbures et de l\'eau du r?seau d\'extinction d\'incendie)'),('USR-4','Fire water & oil recovery pit of Unit **(Fosse de r?cup?ration des hydrocarbures et de l\'eau du r?seau d\'extinction d\'incendie)'),('UST','Hazardous Storage Building (Local d\'Entreposage des Mati?res Dangereuses)'),('UST-1','Workshop Building (Ateliers)'),('UST-2','Stores Building (Magasin)'),('USX','Fire Fighting Foam Station (Local pour Production de Mousse)'),('USZ','Air supply unit for turbine building (Alimentateur d\'air pour b?timent de turbine)'),('UTF','Air Compressor Building (Local des Compresseurs)'),('UTG','Natural Gas Supply Shelter (Abri Poste Gaz)'),('UTG-1','Hydrogen Generation Building (Station de Production d\'Hydrog?ne)'),('UTG-2','Natural Gas Supply Station (Poste Gaz)'),('UTK','Diesel Oil Pump House (B?timent Pompage Combustible Gasoil)'),('UXA','Sea Water Desalination Plant (Station de Dessalement)'),('UYC','Administration Building (B?timent Administratif)'),('UYD','Canteen Building (B?timent de Cantine)'),('UYE','Guard Station (Poste de Garde)'),('UYF','Security Tower (Miradors)'),('UZA-1','Road & Paving (roote et dallage)'),('UZA-2','Lighting pole (?claraoe)'),('UZD','Covered Parking Area (Aires de Parcage)'),('UZJ-1','Main Gate(Acc?s principal)'),('UZJ-2','Fence (clotures et portails)'),('UZR','Temporay wharf for unloading (Quai de d?chargement temporaire)'),('UZX','Site grading & Landscape Nive lement de terraim & espacesvert');
UNLOCK TABLES;

--

-- Table structure for table `systems`
--

DROP TABLE IF EXISTS `systems`;
CREATE TABLE `systems` (
  `systemID` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `systemName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`systemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `systems`
--

LOCK TABLES `systems` WRITE;
INSERT INTO `systems` VALUES ('UA','Structures for grid and distribution systems'),('UB','Structures for power transmission and auxiliary power supply'),('UC','Structures for instrumentation and control'),('UE','Structures for fuel supply and residues disposal'),('UG','Structures for water supply and disposal'),('UH','Structures for heat generation'),('UI','Pipe Rack'),('UK','Tank'),('UL','\"Structures for steam. water. gas cycles\"'),('UM','Structures for main machine sets'),('UP','Structures for circulating water systems (e.g. circulating water intake)'),('UQ','Structures for circulating (cooling) water systems (e.g. circulating water pumps and outfall)'),('UR','Structures for circulating (cooling) water systems (e.g. recirculation cooling)'),('US','Structures for ancillary systems'),('UT','Structures for auxiliary systems'),('UX','Structures for external systems (power plant-specific)'),('UY','General service structures'),('UZ','\"Structures for transport. traffic. fencing. gardens and other purposes\"');
UNLOCK TABLES;

--

-- Table structure for table `tagnumberdetail`
--

DROP TABLE IF EXISTS `tagnumberdetail`;
CREATE TABLE `tagnumberdetail` (
  `tagNumber` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `systemID` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subsystem` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discipline` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`tagNumber`,`systemID`,`subsystem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `tagnumberdetail`
--

LOCK TABLES `tagnumberdetail` WRITE;
UNLOCK TABLES;

--

-- Table structure for table `unit`
--

DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `unit` char(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unitName` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `unit`
--

LOCK TABLES `unit` WRITE;
INSERT INTO `unit` VALUES ('10','10블럭');
UNLOCK TABLES;

--

-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userID` char(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userName` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `authority` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `personalID` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES ('user1','$2b$10$0YK6xaUMN6s8RvgL.1t.2uZdEHIP.nQNs8BEBDvWy6IS4Tekyr8XK','Abdul Habib','xxx@gmail.com','Shell','1','897654','123','1'),('user2','$2b$10$0YK6xaUMN6s8RvgL.1t.2uZdEHIP.nQNs8BEBDvWy6IS4Tekyr8XK','Abdul Habib','xxx@gmail.com','Shell','1','897654','123','1'),('user3','$2b$10$0YK6xaUMN6s8RvgL.1t.2uZdEHIP.nQNs8BEBDvWy6IS4Tekyr8XK','Jack king','jack@gmail.com','Daewoo','3','','456','1'),('user4','$2b$10$0YK6xaUMN6s8RvgL.1t.2uZdEHIP.nQNs8BEBDvWy6IS4Tekyr8XK','Welter','welter@gmail.com','Daewoo','3','','456','0');
UNLOCK TABLES;

--

-- Table structure for table `usercomment`
--

DROP TABLE IF EXISTS `usercomment`;
CREATE TABLE `usercomment` (
  `punchID` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seq` tinyint NOT NULL,
  `writtenDate` datetime DEFAULT NULL,
  `userID` char(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comments` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`punchID`,`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--

-- Dumping data for table `usercomment`
--

LOCK TABLES `usercomment` WRITE;
UNLOCK TABLES;

-- Dump completed on 2021-08-24 14:43:07



# nodejs
