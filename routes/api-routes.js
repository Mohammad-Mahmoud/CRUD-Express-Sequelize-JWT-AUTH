const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const passport = require('passport')
const passportJWT = require('passport-jwt');
const controller = require('../controller/user')
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = controller.getUser({ id: jwt_payload.id });

    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});
// use the strategy
passport.use(strategy);

const comparePassword = (password, hash) => {
    let comp = bcrypt.compareSync(password, hash)
    return comp
}

module.exports = (app) =>{
    app.post('/login', async (req, res) => {

        const { email, password } = req.body;
        if (email && password) {
           const user = await controller.getUser({email: email})
            if (!user) {
                return res.status(401).json({ message: 'No such user found' });
            }
            if (comparePassword(password, user.password) === true) {

                let payload = { id: user.id };
                let token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({ msg: 'Authenticated', token: token });
            } else {
                res.status(401).json({ msg: 'Password is incorrect' });
            }
        }
    })

    app.post('/signup', async (req, res) => {
        const {email, password, name, mobile, country} = req.body
        const user = await controller.getUser(email)
        if(user) {
            return res.json({msg: 'Email already registered'})
        }
        await controller.createUser(email, password, name, mobile, country)
    })

    // Protected route
    app.get('/access', passport.authenticate('jwt', { session: false }), async function(req, res) {

       res.send('You have access to the protected route')
    });
}
