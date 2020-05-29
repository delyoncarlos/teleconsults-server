-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 28, 2020 at 08:22 PM
-- Server version: 8.0.18
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bitnami_joomla`
--

-- --------------------------------------------------------

--
-- Table structure for table `jos_users`
--

CREATE TABLE `jos_users` (
  `id` int(11) NOT NULL,
  `name` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `block` tinyint(4) NOT NULL DEFAULT '0',
  `sendEmail` tinyint(4) DEFAULT '0',
  `registerDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `lastvisitDate` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `activation` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastResetTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'Date of last password reset',
  `resetCount` int(11) NOT NULL DEFAULT '0' COMMENT 'Count of password resets since lastResetTime',
  `otpKey` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'Two factor authentication encrypted keys',
  `otep` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'One time emergency passwords',
  `requireReset` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Require user to reset password on next login'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jos_users`
--

INSERT INTO `jos_users` (`id`, `name`, `username`, `email`, `password`, `block`, `sendEmail`, `registerDate`, `lastvisitDate`, `activation`, `params`, `lastResetTime`, `resetCount`, `otpKey`, `otep`, `requireReset`) VALUES
(42, 'Leonel', 'leonel', 'user@example.com', '$2y$10$sxcsVEQSndlYnsnRLM4tLOMpT/bLYbVUHYKnTzh2k7fE9EjEzX3LW', 0, 1, '2019-12-31 18:02:22', '2020-04-26 14:01:06', '', '{}', '0000-00-00 00:00:00', 0, '', '', 0),
(43, 'prueba1', 'prueba1', 'leolavoe@hotmail.com', '$2y$10$mzhj9cyo9N0ye9zwRKpYju8IAahewaDtFBch2101LreXWhh9vyQym', 0, 0, '2020-01-06 13:19:37', '2020-04-14 02:31:32', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(44, 'prueba2', 'prueba2', 'prueba2@mailprueba2.com', '$2y$10$OZMrIsX2auKabwZqCNpWReMMYcoOWQsjD4ggaORpr2qM2BZbazgxO', 0, 0, '2020-01-06 13:27:21', '2020-01-09 17:22:26', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(45, 'MEDICO1', 'medico1', 'lvasquez@gbt.tfo.upm.es', '$2y$10$OBcp1pwdAyb2WXpzPbP5X.vHtevTkBi3wfvF/hsXgLDICVcU9aP2G', 0, 0, '2020-01-19 16:54:33', '2020-04-26 16:30:56', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"America\\/Guayaquil\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(46, 'MEDICO2', 'medico2', 'medico2@email.com', '$2y$10$s1RFR8iVY7lAsi1HRNFCUeN6wowRqXYZDuytxtCLfuUBGdevvKlEa', 0, 0, '2020-02-11 06:44:38', '2020-04-26 16:31:27', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(47, 'COORDINADOR11', 'coordinador1', 'lvasquez@espol.edu.ec', '$2y$10$rbuZ6mSWmnlRWKnAd1yw4epbC25FhAMDFaO3XWrFc/fe3zGczdHbi', 0, 1, '2020-02-16 08:09:40', '2020-04-21 06:37:14', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(48, 'ruralcayapas', 'ruralcayapas', 'telemedicinacayapas@gmail.com', '$2y$10$iveRI/VZ98ruuEfRccpdAe6YYby5uVl.Q6BMd88CzmdgKwLIOV32W', 0, 1, '2020-02-26 02:45:06', '2020-04-10 16:28:33', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(49, 'Paula Corral', 'pcorralc', 'telemedicina@cayapapichullakumani.com', '$2y$10$Ze6YIOpDvsG1xG5J.k6q7O1b/Ef2RZCPoopTuUD9Pvd7/L7XoW8P6', 0, 1, '2020-03-02 02:41:24', '2020-04-10 16:54:55', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(50, 'SubcentroZG', 'medicozp', 'teleconsultaZG@cayapapichullakumani.com', '$2y$10$BB6HVA2spDg8LfdFS6C66u2QnMqd7ySCy0KzcsLZ8SM8v9CwW9ui6', 0, 1, '2020-03-02 04:26:04', '2020-04-21 06:35:20', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(51, 'Ana García Mingo', 'agarciam', 'anagarciamingo@gmail.com', '$2y$10$HNoW8ZpxTht03LIyeFnXteZLJ9CUz3fAL/r4bbR3RPT0YIcNkPDgW', 0, 1, '2020-03-02 05:07:19', '2020-04-27 19:59:01', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(52, 'Moncef Belhassen García', 'mbelhasseng', 'mbelhassen@hotmail.com', '$2y$10$b2.vjMUNCAyRO1kZ.4u74.4JRBviZqQYMThdNb9pn78m4tmPxwzC.', 0, 1, '2020-03-02 05:11:02', '0000-00-00 00:00:00', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(53, 'Robin Basu', 'rbasu', 'robin.basu-roy@lshtm.ac.uk', '$2y$10$pKY7FTIqvRyjzqcqYUpHzu3wr74JMaMllDtN2qdxr5HJI66o29m8C', 0, 1, '2020-03-02 05:12:46', '0000-00-00 00:00:00', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(54, 'Sara Laliena', 'slaliena', 'saralaliena@gmail.com', '$2y$10$P3rpNEaOmXILzWK2v4AmoenHxxgZzdLXh3rOM2vUavuy5HvRuO1Y.', 0, 1, '2020-03-02 05:14:15', '0000-00-00 00:00:00', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(55, 'Laura Castro', 'lcastro', 'laucasgon@gmail.com', '$2y$10$kRYPNhp4OhwMXRbDEVeJKu99.RuZyGlbanuOdqwQnBvCX7Tq46DPS', 0, 1, '2020-03-02 05:16:03', '2020-03-02 08:18:59', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(56, 'JESUS CASADO CERRADA', 'jcasadoc', 'casadocerrada@telefonica.net', '$2y$10$ODaOHvegusXVfd5hqWMAAelqCpGMWZvc8v3UUyWRNLOwZ5JUf0CMC', 0, 1, '2020-03-02 05:18:55', '0000-00-00 00:00:00', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(57, 'JOSE ANGEL MARTIN OTERINO', 'jamartino', 'jamarot6466@hotmail.com', '$2y$10$cCddBfGixtB0flHKR9jCb.kZaG1RcktLiMaT3/H9KpV0f0iJX.GMm', 0, 1, '2020-03-02 05:20:44', '0000-00-00 00:00:00', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(58, 'ANGELA ROMERO ALEGRIA', 'aromeroa', 'aralegria@yahoo.es', '$2y$10$49kA9SBb4WM39qJMXDg7reLUTAZkcXN/zxTYwYEYLTWRVpc6RpM0C', 0, 1, '2020-03-02 05:22:36', '2020-03-26 09:40:34', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(59, 'ANGELA MARTINEZ', 'amartinez', 'angelamartinezperez@gmail.com', '$2y$10$rvn69GQzmRJ8hEfj2BOOj.z8XEUs51PEAqcuSziiQarIjY3TlJ7NC', 0, 1, '2020-03-02 05:24:37', '2020-03-23 17:59:51', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(60, 'Rafael Faundez Mayo', 'rfaundezm', 'rfaumay@hotmail.com', '$2y$10$ENpN9MP3UjYD0AZf6cc6xOMeKXDnZ6WxhUlAj0iF4.hM33Ou2MZim', 0, 1, '2020-03-02 05:26:08', '2020-03-08 15:09:54', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(61, 'Beatriz Navarro', 'bnavarro', 'bea_nv981@hotmail.com', '$2y$10$26fyIimFTQvgPg1zxSKRj.9VylEIAiWkLvv65hCq3/a48.l.wBRTS', 0, 1, '2020-03-02 05:28:49', '2020-03-03 08:02:17', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(62, 'Virginia Velasco', 'vvelazco', 'virvela@yahoo.es', '$2y$10$riS2bIX4LFGjF7vTq.I55.JUBrfZezmUu11JH2qItbGUS5GTT4chK', 0, 1, '2020-03-02 05:30:08', '0000-00-00 00:00:00', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(63, 'MARIA CERRO MARTINEZ', 'mcerrom', 'mcerrom@gmail.com', '$2y$10$QHMwyT3j0KvAQMfGVKPK/ucMLh6e43yoNjhW0Jqu3QaIPdOiSo3HG', 0, 1, '2020-03-02 05:31:18', '2020-03-02 08:06:26', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(64, 'YAIZA GUTIERREZ FERNANDEZ', 'ygutierrezf', 'guferya@hotmail.com', '$2y$10$2XPNTekXC9IWyER2Kz5yK.0ZWB9G8/Y.VfnCVzEAuYd/dy8ds9Ksy', 0, 1, '2020-03-02 05:32:57', '0000-00-00 00:00:00', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(65, 'NATALIA MINGORANCE', 'nmingorance', 'natmingo@hotmail.com', '$2y$10$VzGOZB4inm1A6svT2umDy.Bv5RUoHZ8gHnr8rFDIeCBUz.b1AaKdu', 0, 1, '2020-03-02 05:34:26', '2020-03-23 18:34:14', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(66, 'EVA HERNANDEZ', 'ehernandez', 'eva.hernandez.faba@gmail.com', '$2y$10$me9orHpugtifm6veBWoIleacZg7Ace8fuOgDy99VkVz9i.KZyccZe', 0, 1, '2020-03-02 05:35:53', '0000-00-00 00:00:00', '', '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"timezone\":\"\"}', '0000-00-00 00:00:00', 0, '', '', 0),
(67, 'leonel2', 'leonel2', '', 'd2064d358136996bd22421584a7cb33e:trd7TvKHx6dMeoMmBVxYmg0vuXEA4199', 0, 0, '2020-03-18 16:18:14', '2020-03-18 16:18:14', '', '', '2020-03-18 16:18:14', 0, '', '', 0),
(68, 'leonel2', 'leonel2', '', 'd2064d358136996bd22421584a7cb33e:trd7TvKHx6dMeoMmBVxYmg0vuXEA4199', 0, 0, '2020-03-18 16:18:44', '2020-03-18 16:18:44', '', '', '2020-03-18 16:18:44', 0, '', '', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jos_users`
--
ALTER TABLE `jos_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`(100)),
  ADD KEY `idx_block` (`block`),
  ADD KEY `username` (`username`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jos_users`
--
ALTER TABLE `jos_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
