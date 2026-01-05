import bcrypt from 'bcrypt';

const password = process.argv[2];

if (!password) {
    console.log('Usage: node scripts/generateHash.js <your_password>');
    process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`\nPassword: ${password}`);
    console.log(`Hashed:   ${hash}\n`);
    console.log(`SQL Example:`);
    console.log(`INSERT INTO users (email, password, fullname, role, department, status) VALUES ('newuser@example.com', '${hash}', 'New User', 'Member', 'IT', 'Active');`);
});
