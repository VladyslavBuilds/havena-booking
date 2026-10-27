'use client';

import { useRouter } from "next/navigation";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";
import { useCallback, useMemo } from "react";
import { format } from 'date-fns';
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";
import RatingBadge from "./RatingBadge";

interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    // Optional second (outline) button, e.g. "Edit" next to "Delete"
    onSecondaryAction?: (id: string) => void;
    secondaryActionLabel?: string;
    currentUser?: SafeUser | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId  = "",
    onSecondaryAction,
    secondaryActionLabel,
    currentUser
}) => {
    const router = useRouter();
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue);

    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            onAction?.(actionId);
        }, [onAction, actionId, disabled]);

    const handleSecondaryAction = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            onSecondaryAction?.(actionId);
        }, [onSecondaryAction, actionId, disabled]);

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }

        return data.price;
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if (!reservation) {
            return null;
        }

        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`
    }, [reservation])

    return (
        <div 
        onClick={() => router.push(`/listings/${data.id}`)}
        className="
            col-span-1 cursor-pointer group
        ">
            <div className="flex flex-col gap-2 w-full">
                <div 
                    className="
                        aspect-square
                        w-full
                        relative
                        overflow-hidden
                        rounded-xl
                    "
                >
                    <Image
                        fill
                        alt="Listing"
                        src={data.imageSrc}
                        className="
                            object-cover
                            h-full
                            w-full
                            group-hover:scale-110
                            transition    
                        "
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton 
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="flex flex-row items-start justify-between gap-2">
                    <div className="font-semibold text-lg">
                        {location?.region}, {location?.label}
                    </div>
                    {/* Rating is only known when the listing was loaded with its reviews */}
                    {data.reviewCount !== undefined && (
                        <div className="shrink-0 pt-1 text-sm">
                            <RatingBadge
                                averageRating={data.averageRating}
                                reviewCount={data.reviewCount}
                            />
                        </div>
                    )}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        ${price}
                    </div>
                    {!reservation && (
                        <div className="font-light">night</div>
                    )}
                </div>
                    {onSecondaryAction && secondaryActionLabel && (
                      <Button
                        disabled={disabled}
                        small
                        outline
                        label={secondaryActionLabel}
                        onClick={handleSecondaryAction}
                      />
                    )}
                    {onAction && actionLabel && (
                      <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                      />
                    )}

            </div>
        </div>
    );
}

export default ListingCard;