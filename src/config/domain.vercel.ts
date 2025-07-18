const verifyDomainValues: {
    id: number;
    Type: string;
    Name: string;
    Value: string;
    TTL: number;
}[] = [
    {
        id: 1, 
        Type: "A", 
        Name: "@",
        Value: "76.76.21.21",
        TTL: 86400
    },
    {
        id: 2, 
        Type: "CNAME", 
        Name: "whatisthis",
        Value: "cname.dub.co",
        TTL: 86400
    }
]

export default verifyDomainValues;