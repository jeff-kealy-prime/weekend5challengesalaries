CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name character varying(60),
    last_name character varying(80),
    id_number integer,
    job_title character varying(80),
    salary integer,
    active boolean DEFAULT true
);
