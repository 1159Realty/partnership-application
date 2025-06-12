"use client";

import { PageTitleBtn } from "@/components/utils";
import { TextField } from "@/components/Inputs";
import { Button, LoadingButton } from "@/components/buttons";
import { Box, InputAdornment, Stack } from "@mui/material";
import { MobileB1MGray900 } from "@/utils/typography";
import { Divider } from "../divider";
import { ArrowLeft, Plus } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/contexts/AlertContext";
import { XCircle } from "@phosphor-icons/react";
import { ValidationError } from "@/services/validation/zod";
import { IProperty, PropertyMarketPrice, PropertyPayload } from "@/lib/api/property/property.types";
import { ApiResult } from "@/utils/global-types";
import { Select } from "../Inputs/Select";
import { COLORS } from "@/utils/colors";
import { useProperty } from "@/lib/api/property/useProperty";

export interface PropertyFormState {
  error: ValidationError<PropertyPayload>;
  result: ApiResult<IProperty>;
}

interface Props {
  property: IProperty | null;
  handleClose?: () => void;
}

function AddMarketPrice({ property, handleClose }: Props) {
  const { setAlert } = useAlertContext();
  const { addPropertyMarketValue } = useProperty();

  const [marketValue, setMarketValue] = useState<PropertyMarketPrice[]>([]);
  const [loading, setLoading] = useState(false);

  const [size, setSize] = useState("");
  const [pricePerSize, setPricePerSize] = useState("");

  function addNewItem() {
    const sizeValue = parseInt(size);
    const priceValue = parseInt(pricePerSize);

    if (isNaN(sizeValue) || isNaN(priceValue)) {
      setAlert({
        message: "Invalid size or market value!",
        show: true,
        severity: "error",
      });
      return;
    }

    if (marketValue.some((x) => x.size === sizeValue)) {
      setAlert({
        message: "Size exists already!",
        show: true,
        severity: "error",
      });
      return;
    }

    setMarketValue((prev) => [...prev, { marketPrice: priceValue, size: sizeValue }]);
    setSize("");
    setPricePerSize("");
  }

  function removeItem(value: number) {
    setMarketValue((prev) => prev.filter((i) => i?.size !== value));
  }

  async function handleSubmit() {
    if (!property?.id) return;
    setLoading(true);
    const res = await addPropertyMarketValue(property.id, marketValue);

    if (res) {
      handleClose?.();
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!property) return;
    const filtered = property?.availableLandSizes?.filter((x) => x?.marketValue);

    setMarketValue(
      filtered?.map((x) => ({
        marketPrice: x.marketValue!,
        size: x?.size,
      })) || []
    );
  }, [property]);

  return (
    <div className="mt-16 pb-8">
      <div className="mb-6">
        <Box px="16px">
          <Stack direction={"row"} alignItems={"center"} spacing={"10px"}>
            <Stack
              borderRadius={"5px"}
              justifyContent={"center"}
              alignItems={"center"}
              width={25}
              height={25}
              bgcolor={COLORS.greenNormal}
              onClick={() => handleClose?.()}
            >
              <ArrowLeft onClick={() => handleClose?.()} size={20} weight="fill" cursor={"pointer"} color="white" />{" "}
            </Stack>
            <PageTitleBtn hideCancel>Update market value</PageTitleBtn>
          </Stack>
        </Box>

        <div className="flex flex-col gap-4 px-4 my-6">
          <MobileB1MGray900>PROPERTY SIZE</MobileB1MGray900>
          <Box>
            <Stack width={"100%"} direction={"row"}>
              <Box flex={"50%"} mr="10px">
                <Select
                  fullWidth
                  items={(property?.availableLandSizes || [])
                    ?.filter((x) => !marketValue?.some((mv) => mv?.size === x?.size))
                    .map((x) => ({
                      label: `${x?.size} SQM`,
                      id: x?.size?.toString(),
                    }))}
                  value={size}
                  onChange={(e) => {
                    setSize(e.target.value as string);
                  }}
                  label="Size"
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">₦</InputAdornment>,
                    },
                  }}
                  value={pricePerSize}
                  onChange={(e) => {
                    setPricePerSize(e.target.value);
                  }}
                  label="Market value"
                />
              </Box>
            </Stack>
          </Box>

          <Box mt="5px">
            <Button
              onClick={() => {
                addNewItem();
              }}
              startIcon={<Plus weight="bold" />}
              sx={{ width: "fit-content" }}
            >
              Add new
            </Button>
          </Box>

          {marketValue.map((i) => (
            <Stack direction={"row"} alignItems={"center"} spacing={"10px"} key={i.size}>
              <MobileB1MGray900>
                {i?.size} SQM - ₦{i?.marketPrice}
              </MobileB1MGray900>
              <XCircle
                onClick={() => {
                  removeItem(i.size);
                }}
                size={20}
                weight="fill"
                cursor={"pointer"}
              />
            </Stack>
          ))}
        </div>
        <Divider />

        {Boolean(marketValue?.length) && (
          <div className="flex flex-col gap-4 px-4 mt-8">
            <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
              Update
            </LoadingButton>
          </div>
        )}
      </div>
    </div>
  );
}

export { AddMarketPrice };
