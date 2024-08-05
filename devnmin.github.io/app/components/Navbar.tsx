import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css'; // 스타일 모듈을 위한 가정
import Mode from '../Elements/DarkMode/DarkMode'
const Navbar = () => {
  return (
    <div >
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">DEV & MIN</Link>
        </div>
        <div className={styles.navItems}>
          <Link href="/"><p>Home</p></Link>
          <Link href="/posts"><p>Posts</p></Link>
          <Link href="/tags"><p>Tags</p></Link>
          <Link href="/about"><p>About</p></Link>
          <Link href="/profile"><p>Profile</p></Link>
          <Mode></Mode>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;
