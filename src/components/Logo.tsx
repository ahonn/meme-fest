import { Title, createStyles } from '@mantine/core';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.black,
  },
  logo: {
    color: '#F7EEDB',
    textTransform: 'uppercase',
    textShadow: `
      3px 0 0 ${theme.black},
      -3px 0 0 ${theme.black},
      0 3px 0 ${theme.black},
      0 -3px 0 ${theme.black},
      3px 3px 0 ${theme.black},
      3px -3px 0 ${theme.black},
      -3px -3px 0 ${theme.black},
      -3px 3px 0 ${theme.black}
    `,
    fontFeatureSettings: "'calt' off",
    fontSize: '24px',
    lineHeight: '32px',
  },
}));

export default function Logo() {
  const { classes } = useStyles();

  return (
    <Link href="/" className={classes.link}>
      <Title size="h1" className={classes.logo}>
        Meme Fest
      </Title>
    </Link>
  );
}
