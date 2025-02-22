INSERT INTO TEACHERS (first_name, last_name)
VALUES ('teacher1', 'test'),
       ('teacher2', 'test');


INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES ('Admin', 'Admin', true, 'test@test.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
        ('User', 'User', false, 'user@test.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq');

INSERT INTO SESSIONS (id, name, description, date, teacher_id) VALUES
(1, 'Yoga1', 'test', '2025-03-01 10:00:00', 1),
(2, 'Yoga2', 'test', '2025-03-02 14:00:00', 2);

INSERT INTO PARTICIPATE (user_id, session_id) VALUES
(1, 1),
(1, 2);