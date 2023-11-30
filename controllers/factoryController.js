
exports.deleteOne = (Model) => 
    async (req, res, next) => {
        try {
            const doc = await Model.findByIdAndDelete(req.params.id);

            if(!doc)
              return next(res.status(404).send('No document found with ID'));


            res.status(204).json({
                  status: "sucess",
                  data: null
            })

        } catch(error) {
            res.status(404).send(error.message);
        } 
      next();
};