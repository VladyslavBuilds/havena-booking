import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";

import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingsView from "./components/listings/ListingsView";

interface HomeProps {
  searchParams: Promise<IListingsParams>
}

const Home = async ({ searchParams }: HomeProps) => {
  const resolvedSearchParams = await searchParams;
  const listings = await getListings(resolvedSearchParams);
  const currentUser = await getCurrentUser();

  // The landing banner is only shown for the unfiltered home page;
  // with filters active the results come first.
  const isFiltered = Object.keys(resolvedSearchParams).length > 0;

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <div className="pt-24">
        <ListingsView
          listings={listings}
          currentUser={currentUser}
          showHero={!isFiltered}
        />
      </div>
    </Container>
  );
}

export default Home;
