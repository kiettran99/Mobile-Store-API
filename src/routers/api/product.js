const router = require('express').Router();
const Product = require('../../models/product');
const storage = require('../../firebase/firebase');
const multer = require('multer');
const auth = require('../../middleware/auth');
const isEmptyObject = require('../../utils/isEmptyObject');

const upload = multer({
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        // Check type file allow jpg, jpeg, png
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload a image.'));
        }

        // Confirm file
        cb(undefined, true);
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.send(products);
    }
    catch (e) {
        cosnole.log(e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.send(product);
    }
    catch (e) {
        cosnole.log(e);
    }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const newProduct = req.body;
        const isEmpty = isEmptyObject(newProduct);

        if (isEmpty) {
            res.status(400).send("Product is empty object.");
        }

        const product = new Product(newProduct);
        await product.save();

        if (req.file) {

            //Create a storage ref
            const storageRef = storage.ref(`/${product._id}/${req.file.originalname}`);

            //Upload image
            await storageRef.put(req.file.buffer);

            product.imageUrl = await storageRef.getDownloadURL();

            await product.save();
        }

        res.send(product);
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ msg: e });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        //Validate a params and body of request.
        const id = req.params.id;
        const productUpdate = req.body;

        if (!id || isEmptyObject(productUpdate)) {
            return res.status(400).send("Please provide id or product.");
        }

        const currentProduct = await Product.findById(id);

        if (!currentProduct) {
            return res.status(404).send("product is not exists.");
        }

        //Validate a object
        const updates = Object.keys(productUpdate);
        const allowUpdates = ['name', 'imageUrl', 'price', 'description', 'manufacturer'
            , 'category', 'conditionProduct', 'quantity'];
        const isValidOperation = updates.every(update => update === 'imageUrl'
            || allowUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: "Invalid update !" });
        }

        updates.forEach(update => currentProduct[update] = productUpdate[update]);

        await currentProduct.save();

        // Check image upload
        if (req.file) {
            const prevImageRef = storage.ref(`/${currentProduct._id.toString()}`);

            prevImageRef.listAll().then((res) => {
                res.items.forEach((itemRef) => {
                    itemRef.delete();
                })
            }).catch((e) => {
                console.log('Fail', e);
            });

            //Create a storage ref
            const storageRef = storage.ref(`/${currentProduct._id}/${req.file.originalname}`);

            //Upload image
            await storageRef.put(req.file.buffer);

            currentProduct.imageUrl = await storageRef.getDownloadURL();

            await currentProduct.save();
        }

        return res.send(currentProduct);
    }
    catch (e) {
        console.log(e);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("Please provide Id.");
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send("Product is not exists");
        }

        //Find a folder image and remove
        const prevImageRef = storage.ref(`/${product._id.toString()}`);

        prevImageRef.listAll().then((res) => {
            res.items.forEach((itemRef) => {
                itemRef.delete();
            })
        }).catch((e) => {
            console.log('Fail', e);
        });

        await product.remove();

        res.send({ "result": "remove successfuly", product });
    }
    catch (e) {
        console.log(e);

        if (e.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product is not exists. ' });
        }

        res.status(500).send('Server is error');
    }
});

module.exports = router;