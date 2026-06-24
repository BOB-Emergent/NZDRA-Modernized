// Sponsor manifest. Logo-tile sponsors have `url` for the image; text-tile
// sponsors omit url and render as styled name plates inside the same uniform
// 180×100 white tile. Every sponsor has an `href` so the tile is clickable —
// confirmed official websites where known, otherwise a Google search fallback
// so visitors can still learn more about the sponsor.
const g = (q) =>
    `https://www.google.com/search?q=${encodeURIComponent(q + " New Zealand drag racing sponsor")}`;

export const SPONSORS = [
    { name: "Proparts", url: "/sponsors/proparts.jpg", href: "http://www.proparts.co.nz/" },
    { name: "Classic Cover", url: "/sponsors/classic-cover.jpg", href: "http://www.classiccover.co.nz/" },
    { name: "Century Batteries", url: "/sponsors/century.jpg", href: "https://www.cyb.co.nz/" },
    { name: "Inpro Insurance & Mortgage", url: "/sponsors/inpro.png", href: "https://www.inprogroup.co.nz/" },
    { name: "Pirtek", url: "/sponsors/pirtek.jpg", href: "https://www.pirtek.co.nz/" },
    { name: "Action Tyres", url: "/sponsors/action-tyres.jpg", href: g("Action Tyres") },
    { name: "Digga", url: "/sponsors/digga.jpg", href: "http://www.digga.co.nz/" },
    { name: "Gourdie Automotive", url: "/sponsors/gourdie.jpg", href: g("Gourdie Automotive") },
    { name: "Rocket Industries", url: "/sponsors/rocket.png", href: "https://www.rocketindustries.com.au/" },
    // Text-tile sponsors (no logo file available yet)
    { name: "Kelford Cams", text: true, href: "https://kelfordcams.com/" },
    { name: "Paralax Racing Cars", text: true, href: g("Paralax Racing Cars") },
    { name: "Advanced Four Wheel Equipment Ltd", text: true, href: g("Advanced Four Wheel Equipment Ltd") },
    { name: "Violets Coffee @ Pit Lane", url: "/sponsors/violets.png", href: g("Violets Coffee at Pit Lane Masterton") },
    { name: "Global Welding Supplies", text: true, href: g("Global Welding Supplies") },
    { name: "Ivan Jones Engineering Ltd", text: true, href: g("Ivan Jones Engineering") },
    // Sanctioning bodies
    { name: "FIA", url: "/sponsors/fia.jpg", href: "https://www.fia.com/" },
    { name: "MotorSport NZ", url: "/sponsors/motorsport-nz.jpg", href: "https://motorsport.org.nz/" },
];
