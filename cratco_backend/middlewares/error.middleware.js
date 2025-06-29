const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};
        error.message = err.message;
        console.error(err);

        if (err && err.name === 'CastError') {
            const message = `Resource not found. Invalid ${err.path}`;
            error = new Error(message);
            error.status = 404;
        }

        if (err && err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.status = 400;
        }

        if (err && err.name === 'ValidationError') {
            const message = Object.values(err.errors)
                .map((val) => val.message)
                .join(', ');
            error = new Error(message);
            error.status = 400;
        }

        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
