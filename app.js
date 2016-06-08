const   express       = require('express'),
        bodyParser    = require('body-parser'),
        http          = require('http'),
        path          = require('path'),
        helmet        = require('helmet'),
        aws           = require('aws-sdk'),
        mongoose      = require('mongoose'),
        app           = express(),
        port          = process.env.PORT || 9000,
        router        = express.Router();


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 5000);
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'jade');
app.use(helmet());
app.use('/api', router);

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET; 

app.get('/', (req, res) => {
    res.render('account');
  //res.render('index', { foo:'index' });
});

router.get('/', function(req, res) {
  res.json({ message: 'Server is go!' });
});

mongoose.connect('mongodb://localhost:27017/models');

app.listen(port, '', err => {
  if(err) return console.log(err);
  console.log(`Listening at http://localhost:${port}`);
});

app.get('/sign_s3', (req, res) => {
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, (err, data) => {
        if(err){
            console.log(err);
        }else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});

app.post('/submit_form', (req, res) => {
    username = req.body.username;
    full_name = req.body.full_name;
    avatar_url = req.body.avatar_url;
    update_account(username, full_name, avatar_url); // TODO: create this function
    // TODO: Return something useful or redirect
});
