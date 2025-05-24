import React from 'react';
import EmptyIllustration from '../../../../../assets/illustration-empty.svg';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-15 mt-30" data-testid="not-found">
      <div>
        <img src={EmptyIllustration} alt="No invoices found" />
      </div>

      <div className="text-center text-text-light dark:text-text-dark flex flex-col gap-5">
        <h2 className="text-2xl font-bold">There is nothing here</h2>
        <p className="text-center text-muted">
          Create an invoice by clicking the <br />
          <span className="font-bold">New Invoice</span> button and get started
        </p>
      </div>
    </div>
  );
};

export default NotFound;
