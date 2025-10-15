export const validate = (schema) => (req, res, next) => {
    try {
        req.data = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        next();
    } catch (e) {
        e.status = 400;
        next(e);
    }
};