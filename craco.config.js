module.exports = {
    style: {
        sass: {
            loaderOptions: {
                additionalData: `
                @import "./src/Core/styles/index.scss";
        `,
            },
        },
    },
};
