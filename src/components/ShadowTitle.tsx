import { Title, createStyles } from '@mantine/core';

export function getStrokeShadow(width: number, color: string) {
  return Array(width * 2)
    .fill(0)
    .reduce(
      (shadows, _, index) => {
        shadows.push(`
            ${(index + 1) * 0.5}px -${width}px 0 ${color},
            ${(index + 1) * 0.5}px ${width}px 0 ${color},
            -${(index + 1) * 0.5}px -${width}px 0 ${color},
            -${(index + 1) * 0.5}px ${width}px 0 ${color},
            ${width}px ${(index + 1) * 0.5}px  0 ${color},
            -${width}px ${(index + 1) * 0.5}px 0 ${color},
            ${width}px -${(index + 1) * 0.5}px  0 ${color},
            -${width}px -${(index + 1) * 0.5}px 0 ${color}
          `);
        return shadows;
      },
      [
        `
          ${width}px 0 0 ${color},
          -${width}px 0 0 ${color},
          0 ${width}px 0 ${color},
          0 -${width}px 0 ${color}
        `,
      ],
    )
    .join(',');
}

const useStyles = createStyles((theme) => ({
  title: {
    color: theme.white,
    textShadow: getStrokeShadow(3, theme.black),
    mixBlendMode: 'darken',
    fontSize: '32px',
    overflow: 'visible',
    lineHeight: '120%',
    marginBottom: '25px',
  },
}));

export type TitleProps = {
  children: string;
};

export default function ShadowTitle(props: TitleProps) {
  const { classes } = useStyles();
  const { children } = props;

  return (
    <Title order={1} className={classes.title}>
      {children}
    </Title>
  );
}
