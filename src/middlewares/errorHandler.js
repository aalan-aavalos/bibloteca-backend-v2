export default function errorHandler(err, _req, res, _next) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        error: err.name || "Error",
        message: err.message || "Unexpected error"
    });
}