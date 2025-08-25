let GhsFormatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GHS',
});

const Ghc = (amount: any) => {
    return GhsFormatter.format(amount);
};

export default Ghc;
