CREATE DEFINER=`root`@`localhost` PROCEDURE `registeruser`(
	email VARCHAR(250),
    phone VARCHAR(45),
    access VARCHAR(1000)
    
)
BEGIN
	INSERT INTO register
    (email, phone, access)
	VALUES
    (email, phone, access);
END