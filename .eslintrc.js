/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next', '@smartive/eslint-config/react'],
  rules: {
    'react/forbid-component-props': [
      'error',
      {
        forbid: [
          {
            propName: 'className',
            allowedFor: [
              'BlockWrapper',
              'ProjectItem',

              // Next.js
              'NextImage',
              'NextLink',

              // DatoCMS
              'DatoSRCImage',
              'DatoVideoPlayer',

              // Radix UI dialog
              'Dialog',
              'DialogTrigger',
              'DialogContent',
              'DialogClose',
              'DialogDescription',
              'DialogOverlay',

              // Carousel
              'Slider',
            ],
            message: 'Avoid using className',
          },
        ],
      },
    ],
  },
};
