import styled from "styled-components";

export const SignInPlain = styled.section`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  min-height: 100vh;
  background: hsl(var(--background));
  text-align: center;
  transition: background 0.3s ease;

  #logo {
    display: block;
    margin-bottom: 70px;
  }

  .main-img {
    width: 80%;
    margin-bottom: 30px;
  }

  .inner-container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
  }
`;

export const SignInPage = styled(SignInPlain)`
  align-items: stretch;
  background: hsl(var(--background));
  position: relative;

  #logo {
    margin-top: 60px;
    margin-bottom: 48px;

    img {
      height: 70px;
      transition: opacity 0.3s ease;
    }
  }

  .inner-container {
    width: 100%;
    max-width: 480px;
    padding: 40px;
    margin: auto;
    
    @media (max-width: 768px) {
      padding: 32px 24px;
    }
  }

  h4 {
    text-align: center;
    margin-top: 32px;
    font-size: 14px;
    font-weight: 500;
    color: hsl(var(--muted-foreground));

    a {
      color: hsl(var(--primary));
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;

      &:hover {
        text-decoration: underline;
        color: hsl(var(--primary) / 0.8);
      }
    }
  }
`;

export const SignUp = styled(SignInPlain)`
  align-items: stretch;
  background: hsl(var(--background));
  position: relative;

  #logo {
    margin-top: 40px;
    margin-bottom: 40px;

    img {
      height: 70px;
      transition: opacity 0.3s ease;
    }
  }

  .inner-container {
    width: 100%;
    max-width: 720px;
    padding: 40px;
    margin: auto;
    margin-bottom: 80px;
    
    @media (max-width: 768px) {
      padding: 32px 24px;
    }
  }

  .logo-wrapper {
    position: relative;
  }

  #sig-in-btn {
    position: absolute;
    left: 10px;
    display: flex;
    align-items: center;
    color: hsl(var(--muted-foreground));
    transition: color 0.3s ease;

    &:hover {
      color: hsl(var(--primary));
    }
  }

  h4 {
    text-align: center;
    margin-top: 32px;
    font-size: 14px;
    font-weight: 500;
    color: hsl(var(--muted-foreground));

    a {
      color: hsl(var(--primary));
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;

      &:hover {
        text-decoration: underline;
        color: hsl(var(--primary) / 0.8);
      }
    }
  }
`;

export const Confirmation = styled.div`
  min-height: 100vh;
  padding-top: 50px;
  background: hsl(var(--background));
  transition: background 0.3s ease;

  #logo {
    text-align: center;
    margin: auto;
    display: block;
    margin-bottom: 80px;
    
    img {
      height: 70px;
      transition: opacity 0.3s ease;
    }
  }

  .btn {
    padding: 8px 10px;
    height: 34px;
    background: hsl(var(--accent));
    border-radius: calc(var(--radius) - 2px);
    color: hsl(var(--accent-foreground));
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    transition: all 0.2s ease;

    &:hover {
      background: hsl(var(--accent) / 0.8);
    }
  }
`;

export const RequestAccessPage = styled(SignUp)`
  background: hsl(var(--background));
  transition: background 0.3s ease;
`;
