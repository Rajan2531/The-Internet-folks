class APIfeatures{
    constructor(mongoQuery, reqQuery)
    {
        this.mongoQuery=mongoQuery;
        this.reqQuery=reqQuery;
    }
    pagination()
    {
        const {limit:perPageDocuments,page:requiredPage}=this.reqQuery;
        if(perPageDocuments&&requiredPage)
        {
            const pagesToSkip=(requiredPage-1)*perPageDocuments*1;
            console.log(pagesToSkip)
            this.mongoQuery=this.mongoQuery.skip(pagesToSkip).limit(perPageDocuments);
            return this;
        }
        return this;
    }

}

module.exports=APIfeatures;