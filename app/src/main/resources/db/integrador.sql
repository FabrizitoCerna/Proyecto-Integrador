-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 29-04-2026 a las 02:39:04
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `integrador`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `Admin_ID` varchar(10) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Correo_Electronico` varchar(100) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Rol` enum('Supervisor','Editor') NOT NULL,
  `DNI` char(8) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administradores`
--

INSERT INTO `administradores` (`Admin_ID`, `Nombre`, `Correo_Electronico`, `Contraseña`, `Rol`, `DNI`, `created_at`) VALUES
('ADM-001', 'Carlos Alberto Reyes Huamán', 'carlos.reyes@empresa.com.pe', '46dc1aa3e9231c52d2fd0d7c9ebf4595ab1fe76fd981cbc8a7dde4e1a0b4c7da', 'Supervisor', '12345678', '2026-04-29 00:34:58'),
('ADM-002', 'María Fernanda López Torres', 'maria.lopez@corporacion.com', 'b7663035afcbef0bc3e9fd78c85cca2e52cc6ef455d4f31b1f63be5e56fa90ae', 'Editor', '87654321', '2026-04-29 00:34:58'),
('ADM-003', 'Jorge Luis Mendoza Rojas', 'jorge.mendoza@negocios.pe', 'ef5e5a1fb95055e0e56cccf98a41e784a132c14e7f6e1ba244302f0e72b29baf', 'Editor', '45678912', '2026-04-29 00:34:58');

--
-- Disparadores `administradores`
--
DELIMITER $$
CREATE TRIGGER `generar_admin_id` BEFORE INSERT ON `administradores` FOR EACH ROW BEGIN
    DECLARE next_num INT;
    DECLARE next_id VARCHAR(10);
    
    SELECT IFNULL(MAX(CAST(SUBSTRING(Admin_ID, 5) AS UNSIGNED)), 0) + 1 INTO next_num
    FROM administradores;
    
    SET next_id = CONCAT('ADM-', LPAD(next_num, 3, '0'));
    SET NEW.Admin_ID = next_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialistas`
--

CREATE TABLE `especialistas` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Especialidad` varchar(100) NOT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT 'Activo',
  `Acciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialistas`
--

INSERT INTO `especialistas` (`ID`, `Nombre`, `Especialidad`, `Telefono`, `Estado`, `Acciones`, `created_at`, `updated_at`) VALUES
(1, 'Juan Carlos Ramírez', 'Gasfitero', '987654321', 'Activo', 'Instalación y reparación de gas natural y GLP', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(2, 'Miguel Ángel Paredes', 'Plomero', '976543210', 'Activo', 'Reparación de tuberías y desagües', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(3, 'Roberto Flores Saavedra', 'Multiservicios', '965432109', 'Activo', 'Mantenimiento general del hogar', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(4, 'Carlos Huamán Torres', 'Albañil', '954321098', 'Activo', 'Construcción y remodelaciones', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(5, 'Pedro Sánchez López', 'Electricista', '943210987', 'Inactivo', 'Instalaciones eléctricas y tableros', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(6, 'Jorge Vásquez Rojas', 'Cerrajero', '932109876', 'Activo', 'Apertura de puertas y cambios de cerraduras', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(7, 'Luis Fernando Díaz', 'Técnico', '921098765', 'Activo', 'Reparación de electrodomésticos', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(8, 'Andrés Mendoza Cruz', 'Gasfitero', '910987654', 'Activo', 'Revisión de fugas y conexiones', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(9, 'Ricardo Castillo León', 'Plomero', '909876543', 'Inactivo', 'Instalación de baños y grifería', '2026-04-29 00:24:28', '2026-04-29 00:24:28'),
(10, 'Fernando Alegría Ríos', 'Electricista', '998765432', 'Activo', 'Mantenimiento de sistemas eléctricos', '2026-04-29 00:24:28', '2026-04-29 00:24:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Usuario_ID` varchar(10) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Telefono_contacto` varchar(15) NOT NULL,
  `Correo_Electronico` varchar(100) NOT NULL,
  `Distrito` varchar(50) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Usuario_ID`, `Nombre`, `Telefono_contacto`, `Correo_Electronico`, `Distrito`, `Direccion`, `Contraseña`, `created_at`) VALUES
('USR-001', 'Carlos Mendoza', '987654321', 'carlos.mendoza@gmail.com', 'Miraflores', 'Av. José Larco 400', 'pass123456', '2026-04-29 00:27:41'),
('USR-002', 'Ana Lucía Torres', '976543210', 'ana.torres@hotmail.com', 'San Isidro', 'Augusto Tamayo 180', 'ana2024', '2026-04-29 00:27:41'),
('USR-003', 'Roberto Sánchez', '965432109', 'roberto.sanchez@yahoo.com', 'Surco', 'Av. Monte de los Olivos 545', 'rob123', '2026-04-29 00:27:41'),
('USR-004', 'María Fernández', '954321098', 'maria.fernandez@gmail.com', 'San Borja', 'Av. Joaquín de la Madrid 200', 'maria123', '2026-04-29 00:27:41'),
('USR-005', 'José Luis Ramírez', '943210987', 'jose.ramirez@gmail.com', 'La Molina', 'Av. Ricardo Elías Aparicio 740', 'joseluis', '2026-04-29 00:27:41'),
('USR-006', 'Patricia Castro', '932109876', 'patricia.castro@hotmail.com', 'San Miguel', 'Federico Gallese 370', 'paty2024', '2026-04-29 00:27:41'),
('USR-007', 'Fernando Alegría', '921098765', 'fernando.alegria@gmail.com', 'Magdalena', 'Av. Brasil 3501', 'fer123', '2026-04-29 00:27:41'),
('USR-008', 'Isabel Rojas', '910987654', 'isabel.rojas@yahoo.com', 'Lince', 'Av. Juan Pardo de Zela 480', 'isabel2024', '2026-04-29 00:27:41'),
('USR-009', 'Ricardo Paz', '909876543', 'ricardo.paz@gmail.com', 'Jesús María', 'Av. Mariátegui', 'ricardo123', '2026-04-29 00:27:41'),
('USR-010', 'Ximena Reyes', '998765432', 'ximena.reyes@hotmail.com', 'Pueblo Libre', 'Av. General Vivanco 859' 'ximena2024', '2026-04-29 00:27:41');

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `generar_usuario_id` BEFORE INSERT ON `usuarios` FOR EACH ROW BEGIN
    DECLARE next_num INT;
    DECLARE next_id VARCHAR(10);
    
    -- Obtener el número máximo actual
    SELECT IFNULL(MAX(CAST(SUBSTRING(Usuario_ID, 5) AS UNSIGNED)), 0) + 1 INTO next_num
    FROM usuarios;
    
    -- Formatear como USR-001, USR-002, etc.
    SET next_id = CONCAT('USR-', LPAD(next_num, 3, '0'));
    
    -- Asignar el ID generado
    SET NEW.Usuario_ID = next_id;
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`Admin_ID`),
  ADD UNIQUE KEY `Correo_Electronico` (`Correo_Electronico`),
  ADD UNIQUE KEY `DNI` (`DNI`);

--
-- Indices de la tabla `especialistas`
--
ALTER TABLE `especialistas`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Usuario_ID`),
  ADD UNIQUE KEY `Correo_Electronico` (`Correo_Electronico`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `especialistas`
--
ALTER TABLE `especialistas`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
