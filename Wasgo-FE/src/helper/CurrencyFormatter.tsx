let GBPFormatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
});

const Gbp = (amount: any) => {
    return GBPFormatter.format(Number(amount ?? 0));
};

export default Gbp;
