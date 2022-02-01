import Header from "../Header";

interface BaseLayoutProps {
  children: React.ReactNode;
}
/**
 * Sets the default header component.
 * @param children nested components
 */
function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <>
      <Header />
      <>{children}</>
    </>
  );
}

export const getLayout = (page: any) => <BaseLayout>{page}</BaseLayout>;

export default BaseLayout;
