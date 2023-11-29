import React, { FC } from "react";
import { TaxonomyType } from "data/types";
import CardCategory1 from "components/CardCategory1/CardCategory1";
import NcModal from "components/NcModal/NcModal";
import Button from "components/Button/Button";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export interface ModalCategoriesProps {
  categories: TaxonomyType[];
  onChangeCate?: (idx: number) => void;
}

const ModalCategories: FC<ModalCategoriesProps> = ({
  categories,
  onChangeCate,
}) => {
  const renderModalContent = (closeModal: () => void) => {
    return (
      <div className="grid gap-6 sm:grid-cols-2 sm:py-2 md:gap-8 md:grid-cols-3 lg:grid-cols-4 xl:md:grid-cols-5">
        {categories.map((cat, idx) => (
          <div
            onClick={() => {
              onChangeCate && onChangeCate(idx);
              closeModal && closeModal();
            }}>
            <CardCategory1 key={cat.id} taxonomy={cat} size="normal" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="nc-ModalCategories">
      <NcModal
        renderTrigger={(openModal) => (
          <Button
            pattern="third"
            fontSize="text-sm font-medium"
            onClick={openModal}>
            <div>
              <span className="hidden sm:inline">Other</span> Categories
            </div>
            <ChevronDownIcon
              className="w-4 h-4 ml-2 -mr-1"
              aria-hidden="true"
            />
          </Button>
        )}
        modalTitle="Discover other categories"
        renderContent={(closeModal) => renderModalContent(closeModal)}

      />
    </div>
  );
};

export default ModalCategories;
