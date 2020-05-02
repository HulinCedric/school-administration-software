-- phpMyAdmin SQL Dump
-- version 3.1.5
-- http://www.phpmyadmin.net
--
-- Serveur: cmstestsite.sql.free.fr
-- Généré le : Mer 27 Juillet 2011 à 15:09
-- Version du serveur: 5.0.83
-- Version de PHP: 5.2.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `cmstestsite`
--

-- --------------------------------------------------------

--
-- Structure de la table `AbscenceCantine`
--

CREATE TABLE IF NOT EXISTS `AbscenceCantine` (
  `Enfant` int(11) NOT NULL,
  `Date` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`Enfant`,`Date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `AbscenceScolaire`
--

CREATE TABLE IF NOT EXISTS `AbscenceScolaire` (
  `Enfant` int(11) NOT NULL,
  `Date` timestamp NOT NULL default CURRENT_TIMESTAMP,
  PRIMARY KEY  (`Enfant`,`Date`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Accompagnateur`
--

CREATE TABLE IF NOT EXISTS `Accompagnateur` (
  `Personnel` int(11) NOT NULL,
  `Lieu` varchar(100) NOT NULL,
  `DateDebut` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`Personnel`,`Lieu`,`DateDebut`),
  KEY `Lieu_idxfk` (`Lieu`,`DateDebut`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Structure de la table `Adresse`
--

CREATE TABLE IF NOT EXISTS `Adresse` (
  `idAdresse` int(11) NOT NULL auto_increment,
  `Voie` varchar(255) NOT NULL,
  `CodePostal` varchar(10) NOT NULL,
  `Commune` varchar(100) NOT NULL,
  `Pays` varchar(40) NOT NULL default 'France',
  `Telephone` varchar(20) default NULL,
  PRIMARY KEY  (`idAdresse`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=280 ;


-- --------------------------------------------------------

--
-- Structure de la table `AffectationCharge`
--

CREATE TABLE IF NOT EXISTS `AffectationCharge` (
  `Charge` varchar(100) NOT NULL,
  `Enseignant` int(11) NOT NULL,
  `Annee` varchar(9) NOT NULL,
  `Statut` enum('Permanent','Remplaçant') default NULL,
  PRIMARY KEY  (`Charge`,`Enseignant`,`Annee`),
  KEY `Enseignant_idxfk_1` (`Enseignant`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `AssociationResponsableLegal`
--

CREATE TABLE IF NOT EXISTS `AssociationResponsableLegal` (
  `Responsable` int(11) NOT NULL,
  `Enfant` int(11) NOT NULL,
  `Statut` enum('Père','Mère','Autre') NOT NULL,
  `AutoriteParentale` enum('Oui','Non') NOT NULL default 'Oui',
  `AdressePrincipale` enum('Oui','Non') NOT NULL default 'Non',
  PRIMARY KEY  (`Responsable`,`Enfant`),
  KEY `Enfant_idxfk_4` (`Enfant`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Charge`
--

CREATE TABLE IF NOT EXISTS `Charge` (
  `Nom` varchar(100) NOT NULL default '',
  PRIMARY KEY  (`Nom`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Classe`
--

CREATE TABLE IF NOT EXISTS `Classe` (
  `Nom` varchar(100) NOT NULL,
  `Promotion` varchar(9) NOT NULL,
  `Enseignant` int(11) NOT NULL,
  `Niveau1` enum('PS','MS','GS','CP','CE1','CE2','CM1','CM2','6e','5e','4e','3e') NOT NULL,
  `Niveau2` enum('PS','MS','GS','CP','CE1','CE2','CM1','CM2','6e','5e','4e','3e') default NULL,
  `ServiceCantine` varchar(100) NOT NULL,
  PRIMARY KEY  (`Nom`,`Promotion`),
  KEY `Enseignant_idxfk` (`Enseignant`),
  KEY `Niveau1_idxfk` (`Niveau1`),
  KEY `Niveau2_idxfk` (`Niveau2`),
  KEY `ServiceCantine_idxfk` (`ServiceCantine`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ClasseVerte`
--

CREATE TABLE IF NOT EXISTS `ClasseVerte` (
  `Lieu` varchar(100) NOT NULL,
  `DateDebut` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `DateFin` timestamp NOT NULL default '0000-00-00 00:00:00',
  `PrixComptable` float NOT NULL,
  `PrixAssociation` float default NULL,
  `AideAssociation` float default NULL,
  `AccompagnateursAutres` text,
  PRIMARY KEY  (`Lieu`,`DateDebut`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Structure de la table `Enfant`
--

CREATE TABLE IF NOT EXISTS `Enfant` (
  `idEnfant` int(11) NOT NULL auto_increment,
  `INE` varchar(10) default NULL,
  `RegistreMatricule` varchar(20) default NULL,
  `DatePremiereDemande` timestamp NULL default NULL,
  `DateRadiation` timestamp NULL default NULL,
  `Sexe` enum('M','F') NOT NULL,
  `Nom` varchar(50) NOT NULL,
  `NomUsage` varchar(50) default NULL,
  `Prenom` varchar(50) NOT NULL,
  `DateNaissance` timestamp NULL default NULL,
  `Nationalite` varchar(100) NOT NULL default 'Française',
  `CommuneNaissance` varchar(100) default NULL,
  `DepartementNaissance` varchar(100) default NULL,
  `PaysNaissance` varchar(40) default NULL,
  `Niveau` enum('PS','MS','GS','CP','CE1','CE2','CM1','CM2','6e','5e','4e','3e') NOT NULL,
  `LangueVivante1` enum('Anglais','Italien','Allemand','Espagnol') default NULL,
  `LangueVivante2` enum('Anglais','Italien','Allemand','Espagnol') default NULL,
  `Sieste` enum('Oui','Non') default NULL,
  `Regime` enum('Demi Pensionnaire','Externe') default 'Demi Pensionnaire',
  `Boursier` enum('Oui','Non') default NULL,
  `ResponsabiliteCivile` enum('Oui','Non') default NULL,
  `IndividuelleAccident` enum('Oui','Non') default NULL,
  `CompagnieAssurance` varchar(100) default NULL,
  `NumeroPoliceAssurance` varchar(50) default NULL,
  `AttestationFournie` enum('Oui','Non') NOT NULL default 'Non',
  `GarderieMatin` enum('Oui','Non') default 'Non',
  `GarderieSoir` enum('Oui','Non') default 'Non',
  `DiffusionAdresseAssociation` enum('Oui','Non') NOT NULL default 'Oui',
  `PAI` enum('Oui','Non') default 'Non',
  `MDPH` enum('Oui','Non') default 'Non',
  PRIMARY KEY  (`idEnfant`),
  KEY `Niveau_idxfk_1` (`Niveau`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=347 ;

-- --------------------------------------------------------

--
-- Structure de la table `Etablissement`
--

CREATE TABLE IF NOT EXISTS `Etablissement` (
  `Nom` varchar(100) default NULL,
  `Adresse` int(11) default NULL,
  UNIQUE KEY `Nom` (`Nom`),
  KEY `Adresse_idxfk_1` (`Adresse`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Module`
--

CREATE TABLE IF NOT EXISTS `Module` (
  `Niveau` enum('PS','MS','GS','CP','CE1','CE2','CM1','CM2','6e','5e','4e','3e') NOT NULL default 'PS',
  `Groupe` enum('1','2','3','4') NOT NULL default '1',
  PRIMARY KEY  (`Niveau`,`Groupe`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Niveau`
--

CREATE TABLE IF NOT EXISTS `Niveau` (
  `Nom` enum('PS','MS','GS','CP','CE1','CE2','CM1','CM2','6e','5e','4e','3e') NOT NULL default 'PS',
  `NomComplet` enum('Petite section','Moyenne section','Grande section','Cours préparatoire','Cours élémentaire 1re année','Cours élémentaire 2e année','Cours moyen 1re année','Cours moyen 2e année','6e','5e','4e','3e') NOT NULL,
  `Cycle` enum('Cycle 1','Cycle 2','Cycle 3','Cycle d''adaptation','Cycle central','Cycle d''orientation') NOT NULL,
  PRIMARY KEY  (`Nom`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Participant`
--

CREATE TABLE IF NOT EXISTS `Participant` (
  `Enfant` int(11) NOT NULL,
  `Lieu` varchar(100) NOT NULL,
  `DateDebut` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `PrixVerse` float default '0',
  PRIMARY KEY  (`Enfant`,`Lieu`,`DateDebut`),
  KEY `Lieu_idxfk_1` (`Lieu`,`DateDebut`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Personnel`
--

CREATE TABLE IF NOT EXISTS `Personnel` (
  `idPersonnel` int(11) NOT NULL auto_increment,
  `DateEntreeEcole` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `DateRadiation` timestamp NULL default NULL,
  `Civilite` enum('M.','Mme','Mlle') default NULL,
  `Nom` varchar(50) NOT NULL,
  `NomUsage` varchar(50) default NULL,
  `Prenom` varchar(50) NOT NULL,
  `Adresse` int(11) default NULL,
  `Fonction` enum('Enseignant','Personnel','AVS') default NULL,
  `TelephonePortable` varchar(10) default NULL,
  `Mail` varchar(100) default NULL,
  PRIMARY KEY  (`idPersonnel`),
  KEY `Adresse_idxfk_2` (`Adresse`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- Structure de la table `ResponsableLegal`
--

CREATE TABLE IF NOT EXISTS `ResponsableLegal` (
  `idResponsableLegal` int(11) NOT NULL auto_increment,
  `Civilite` enum('M.','Mme','Mlle') default NULL,
  `Nom` varchar(50) default NULL,
  `NomUsage` varchar(50) default NULL,
  `Prenom` varchar(50) default NULL,
  `Adresse` int(11) default NULL,
  `Profession` varchar(255) default NULL,
  `TelephoneProfessionnel` varchar(10) default NULL,
  `TelephonePortable` varchar(10) default NULL,
  `Mail` varchar(100) default NULL,
  PRIMARY KEY  (`idResponsableLegal`),
  KEY `Adresse_idxfk` (`Adresse`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=469 ;

-- --------------------------------------------------------

--
-- Structure de la table `Scolariteexterne`
--

CREATE TABLE IF NOT EXISTS `Scolariteexterne` (
  `Enfant` int(11) NOT NULL default '0',
  `Promotion` varchar(9) NOT NULL default '',
  `Classeexterne` varchar(100) NOT NULL,
  `Etablissement` varchar(100) default NULL,
  PRIMARY KEY  (`Enfant`,`Promotion`),
  KEY `Etablissement_idxfk_1` (`Etablissement`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `Scolariteinterne`
--

CREATE TABLE IF NOT EXISTS `Scolariteinterne` (
  `Enfant` int(11) NOT NULL default '0',
  `Promotion` varchar(9) NOT NULL default '',
  `Classe` varchar(100) default NULL,
  `GroupeDeModule` enum('1','2','3','4') default NULL,
  `Niveau` enum('PS','MS','GS','CP','CE1','CE2','CM1','CM2','6e','5e','4e','3e') default NULL,
  `DemiGroupe` enum('1','2') default NULL,
  `AutorisationSortie` enum('Oui','Non') default 'Non',
  `DateDemandeInscription` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `DecisionCommission` enum('Oui','Non') default NULL,
  `ConfirmationParents` enum('Oui','Non') default NULL,
  `DateEntreeEcole` timestamp NULL default NULL,
  PRIMARY KEY  (`Enfant`,`Promotion`),
  KEY `Classe_idxfk` (`Classe`,`Promotion`),
  KEY `GroupeDeModule_idxfk` (`GroupeDeModule`,`Niveau`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ServiceCantine`
--

CREATE TABLE IF NOT EXISTS `ServiceCantine` (
  `NomService` varchar(100) NOT NULL,
  `HeureRepas` varchar(5) NOT NULL,
  PRIMARY KEY  (`NomService`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
