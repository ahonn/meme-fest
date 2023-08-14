import { Title, createStyles } from '@mantine/core';
import Link from 'next/link';
import { getStrokeShadow } from './ShadowTitle';

const useStyles = createStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.black,
  },
  logo: {
    color: '#F7EEDB',
    textTransform: 'uppercase',
    textShadow: getStrokeShadow(3, theme.black),
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
