let smartgrid = require('smart-grid');

/* It's principal settings in smart grid project */
let settings = {
    outputStyle: 'less', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '20px', /* gutter width px || % || rem */
    mobileFirst: true, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1135px', /* max-width оn very large screen */
        fields: '10px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '992px'
        },
        sm: {
            width: '720px',
            /*fields: '15px'  set fields only if you want to change container.fields */
        },
        xs: {
            width: '576px'
        }
        /*
         We can create any quantity of break points.

         some_name: {
         width: 'Npx',
         fields: 'N(px|%|rem)',
         offset: 'N(px|%|rem)'
         }
         */
    }
};

smartgrid('./src/precss', settings);
