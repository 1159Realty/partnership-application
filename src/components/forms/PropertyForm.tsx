"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { FileUpload, TextField } from "@/components/Inputs";
import { Button, IconButton, LoadingButton } from "@/components/buttons";
import { Box, InputAdornment, Stack } from "@mui/material";
import { ErrorText, MobileB1MGray900 } from "@/utils/typography";
import { AutoComplete } from "../Inputs/AutoComplete";
import { Divider } from "../divider";
import { Plus, CurrencyNgn } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/contexts/AlertContext";
import { XCircle } from "@phosphor-icons/react";
import { ValidationError } from "@/services/validation/zod";
import {
  IProperty,
  PROPERTY_LAND_TYPE,
  PropertyFormPayload,
  PropertyPayload,
  UpdatePropertyFormPayload,
} from "@/lib/api/property/property.types";
import { useProperty } from "@/lib/api/property/useProperty";
import { IArea, ILga, IState } from "@/lib/api/location/location.types";
import { useLocation } from "@/lib/api/location/useLocation";
import { FileType } from "@/lib/api/file-upload/file-upload.types";
import { ApiResult } from "@/utils/global-types";
import { usePropertyManagementContext } from "@/modules/propertyManagement/PropertyManagementContext";
import { Select, SelectWithStatus } from "../Inputs/Select";
import { COLORS, SEVERITY_COLORS } from "@/utils/colors";
import { Tooltip } from "../tooltip";
import { AddMarketPrice } from "./AddPropertyMarketValue";
import { capitalizeAndSpace } from "@/services/string";

export interface PropertyFormState {
  error: ValidationError<PropertyPayload>;
  result: ApiResult<IProperty>;
}

type ListValue = "duration" | "size";

interface CreatePropertyFormProps {
  states: IState[] | null;
  onCreate?: (property: IProperty) => void;
}

function CreatePropertyForm({ states, onCreate }: CreatePropertyFormProps) {
  const initialState: PropertyFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { showCreateProperty, setShowCreateProperty } = usePropertyManagementContext();
  const { createProperty } = useProperty();
  const { fetchLgas, fetchAreas } = useLocation();

  const [formState, setFormState] = useState<PropertyFormPayload>({
    propertyName: "",
    propertyPic: "",
    stateId: "",
    lgaId: "",
    areaId: "",
    totalLandSize: "",
    availableLandSizes: [],
    paymentDurationOptions: [],
    installmentInterest: 1.2,
    overDueInterest: 1.5,
    installmentPeriod: 32,
    address: "",
    landType: "",
    youtubeUrl: "",
  });
  const [error, setError] = useState<ValidationError<PropertyPayload>>({});
  const [loading, setLoading] = useState(false);

  const [lgas, setLgas] = useState<ILga[] | null>([]);
  const [areas, setAreas] = useState<IArea[] | null>([]);
  const [duration, setDuration] = useState("");
  const [size, setSize] = useState("");
  const [pricePerSize, setPricePerSize] = useState("");

  const [files, setFiles] = useState<FileType[]>([]);

  const onClose = () => {
    setShowCreateProperty(false);
  };

  function addNewItem(type: ListValue) {
    if (type === "duration") {
      const value = parseInt(duration);
      if (isNaN(value)) {
        setAlert({
          message: "Invalid duration!",
          show: true,
          severity: "error",
        });
        return;
      }

      if (formState.paymentDurationOptions.includes(value)) {
        setAlert({
          message: "Duration exists already!",
          show: true,
          severity: "error",
        });
        return;
      }
      setFormState((prev) => ({ ...prev, paymentDurationOptions: [...prev.paymentDurationOptions, value] }));
      setDuration("");
    } else {
      const sizeValue = parseInt(size);
      const priceValue = parseInt(pricePerSize);

      if (isNaN(sizeValue) || isNaN(priceValue)) {
        setAlert({
          message: "Invalid size or price!",
          show: true,
          severity: "error",
        });
        return;
      }

      if (formState.availableLandSizes.some((x) => x.size === sizeValue)) {
        setAlert({
          message: "Size exists already!",
          show: true,
          severity: "error",
        });
        return;
      }

      setFormState((prev) => ({
        ...prev,
        availableLandSizes: [...prev.availableLandSizes, { price: priceValue, size: sizeValue }],
      }));
      setSize("");
      setPricePerSize("");
    }
  }

  function removeItem(type: "duration" | "size", value: number) {
    if (type === "duration") {
      setFormState((prev) => ({ ...prev, paymentDurationOptions: prev.paymentDurationOptions.filter((i) => i !== value) }));
    } else {
      setFormState((prev) => ({ ...prev, availableLandSizes: prev.availableLandSizes.filter((i) => i.size !== value) }));
    }
  }

  async function handleCreateProperty() {
    setLoading(true);

    const payload = { ...formState };
    payload.propertyPic = files[0];
    payload.totalLandSize = parseInt(payload.totalLandSize.toString());

    const { error, result } = await createProperty(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Property created", show: true, severity: "success" });
      setShowCreateProperty(false);
    }
    if (error.requestError) {
      setAlert({ message: error.requestError, show: true, severity: "error" });
      delete error.requestError;
    } else if (Object.keys(error).length) {
      setError(error);
      setAlert({ message: "Complete the required fields", show: true, severity: "error" });
    }
    setLoading(false);
  }

  function handleChange(field: keyof PropertyPayload, value: string) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof PropertyPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  useEffect(() => {
    if (!formState?.stateId) return;
    async function populateLgas() {
      const response = await fetchLgas(formState.stateId);
      setLgas(response);
    }

    populateLgas();
  }, [fetchLgas, formState?.stateId]);

  useEffect(() => {
    if (!formState?.lgaId) return;
    async function populateAreas() {
      const response = await fetchAreas({ lgaId: formState.lgaId });
      setAreas(response?.items || []);
    }

    populateAreas();
  }, [fetchAreas, fetchLgas, formState.lgaId]);

  return (
    <Drawer isOpen={showCreateProperty} handleClose={onClose}>
      <div className="mt-16 pb-8">
        <div className="mb-6">
          <Box px="16px">
            <PageTitleBtn hideCancel>Add new property</PageTitleBtn>
          </Box>

          <div className="flex flex-col mt-8 gap-4">
            <div className="flex flex-col gap-4  px-4">
              <MobileB1MGray900>PROPERTY DESCRIPTION</MobileB1MGray900>
              <Box>
                <TextField
                  fullWidth
                  onChange={(e) => handleChange("propertyName", e.target.value)}
                  name="propertyName"
                  value={formState.propertyName}
                  label="Name"
                />
                {error?.propertyName?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box>
                <Select
                  label="Land size"
                  value={formState.landType}
                  items={PROPERTY_LAND_TYPE.map((x) => ({
                    id: x,
                    label: capitalizeAndSpace(x),
                  }))}
                  onChange={(e) => handleChange("landType", e.target.value as string)}
                />
                {error?.landType?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box>
                <TextField
                  fullWidth
                  onChange={(e) => handleChange("totalLandSize", e.target.value)}
                  name="totalLandSize"
                  value={formState.totalLandSize}
                  label="Total Size"
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">SQM</InputAdornment>,
                    },
                  }}
                />
                {error?.totalLandSize?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>
            </div>
            <Divider />

            <div className="flex flex-col gap-4 px-4">
              <MobileB1MGray900>PROPERTY SIZE</MobileB1MGray900>
              <Box>
                <Stack direction={"row"}>
                  <Box mr="10px">
                    <TextField
                      fullWidth
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="start">SQM</InputAdornment>,
                        },
                      }}
                      value={size}
                      onChange={(e) => {
                        handleReset("availableLandSizes");
                        setSize(e.target.value);
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
                        handleReset("availableLandSizes");
                        setPricePerSize(e.target.value);
                      }}
                      label="Price"
                    />
                  </Box>
                </Stack>
                {error?.availableLandSizes?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Stack>
                <Button
                  onClick={() => {
                    handleReset("availableLandSizes");
                    addNewItem("size");
                  }}
                  startIcon={<Plus weight="bold" />}
                  sx={{ width: "fit-content" }}
                >
                  Add new
                </Button>
              </Stack>

              {formState.availableLandSizes.map((i) => (
                <Stack direction={"row"} alignItems={"center"} spacing={"10px"} key={i.size}>
                  <MobileB1MGray900>
                    {i.size} SQM - ₦{i.price}
                  </MobileB1MGray900>
                  <XCircle
                    onClick={() => {
                      handleReset("availableLandSizes");
                      removeItem("size", i.size);
                    }}
                    size={20}
                    weight="fill"
                    cursor={"pointer"}
                  />
                </Stack>
              ))}
            </div>
            <Divider />

            <div className="flex flex-col gap-4 px-4">
              <MobileB1MGray900>PAYMENT DURATION</MobileB1MGray900>
              <Box>
                <TextField
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">Months</InputAdornment>,
                    },
                  }}
                  value={duration}
                  onChange={(e) => {
                    handleReset("availableLandSizes");
                    setDuration(e.target.value);
                  }}
                  label="Duration"
                />
                {error?.paymentDurationOptions?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Stack>
                <Button
                  onClick={() => {
                    handleReset("availableLandSizes");
                    addNewItem("duration");
                  }}
                  startIcon={<Plus weight="bold" />}
                  sx={{ width: "fit-content" }}
                >
                  Add new
                </Button>
              </Stack>

              {formState.paymentDurationOptions.map((i) => (
                <Stack direction={"row"} alignItems={"center"} spacing={"10px"} key={i}>
                  <MobileB1MGray900>{i} Months</MobileB1MGray900>
                  <XCircle
                    onClick={() => {
                      handleReset("availableLandSizes");
                      removeItem("duration", i);
                    }}
                    size={20}
                    weight="fill"
                    cursor={"pointer"}
                  />
                </Stack>
              ))}
            </div>
            <Divider />

            <div className="flex flex-col gap-4 px-4">
              <MobileB1MGray900>LOCATION</MobileB1MGray900>
              <Box>
                <AutoComplete
                  fullWidth
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  options={(states || []).map((s) => ({ label: s.state, id: s.id }))}
                  renderInputLabel="State"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(_, value: any) => {
                    if (value.id) {
                      handleChange("stateId", value.id);
                    }
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onInputChange={(_, value: any) => {
                    if (!value) {
                      handleChange("lgaId", "");
                    }
                  }}
                  value={(states || []).find((s) => s.id === formState.stateId)?.state || ""}
                />
                {error?.stateId?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box>
                <AutoComplete
                  options={(lgas || []).map((lga) => ({ label: lga.lga, id: lga.id }))}
                  renderInputLabel="Lga"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(_, value: any) => {
                    handleChange("lgaId", value.id);
                  }}
                  value={(lgas || []).find((lga) => lga.id === formState.lgaId)?.lga || ""}
                />
                {error?.lgaId?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box>
                <AutoComplete
                  options={(areas || []).map((a) => ({ label: a.area, id: a.id }))}
                  renderInputLabel="Area"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(_, value: any) => {
                    handleChange("areaId", value.id);
                  }}
                  value={(areas || []).find((a) => a.id === formState.areaId)?.area || ""}
                />
                {error?.areaId?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box>
                <TextField
                  fullWidth
                  onChange={(e) => handleChange("address", e.target.value)}
                  name="address"
                  value={formState.address}
                  label="Land mark"
                />
                {error?.address?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>
            </div>
            <Divider />

            <div className="flex flex-col gap-4 px-4">
              <MobileB1MGray900>INTEREST & OVERDUE</MobileB1MGray900>
              <Box>
                <TextField
                  fullWidth
                  onChange={(e) => handleChange("installmentInterest", e.target.value)}
                  name="installmentInterest"
                  value={formState.installmentInterest}
                  label="Installment interest"
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    },
                  }}
                />
                {error?.installmentInterest?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box>
                <TextField
                  fullWidth
                  onChange={(e) => handleChange("overDueInterest", e.target.value)}
                  name="overDueInterest"
                  value={formState.overDueInterest}
                  label="Overdue interest"
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">%</InputAdornment>,
                    },
                  }}
                />
                {error?.overDueInterest?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box>
                <TextField
                  fullWidth
                  onChange={(e) => handleChange("installmentPeriod", e.target.value)}
                  name="installmentPeriod"
                  value={formState.installmentPeriod}
                  label="Installment period"
                  slotProps={{
                    input: {
                      endAdornment: <InputAdornment position="start">Days</InputAdornment>,
                    },
                  }}
                />
                {error?.installmentPeriod?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>
            </div>
            <Divider />

            <div className="flex flex-col gap-4 px-4">
              <MobileB1MGray900>BANNER</MobileB1MGray900>
              <Box>
                <TextField
                  fullWidth
                  onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                  name="youtubeUrl"
                  value={formState.youtubeUrl}
                  label="Youtube link"
                />
                {error?.youtubeUrl?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box>
                <FileUpload
                  handleReset={() => handleReset("propertyPic")}
                  files={files}
                  setFiles={setFiles}
                  label="Add property banner"
                />
                {error?.propertyPic?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>
            </div>
            <Divider />

            <div className="flex flex-col gap-4 px-4">
              <LoadingButton loadingPosition="end" loading={loading} onClick={handleCreateProperty}>
                Add Property
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

interface UpdatePropertyFormProps {
  onUpdate?: (property: IProperty) => void;
  property: IProperty | null;
  handleClose?: () => void;
}

function UpdatePropertyForm({ onUpdate, property, handleClose }: UpdatePropertyFormProps) {
  const initialState: PropertyFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { updateProperty } = useProperty();

  const [showMarketValue, setShowMarketValue] = useState(false);

  const [formState, setFormState] = useState<UpdatePropertyFormPayload>({
    id: "",
    propertyName: "",
    propertyPic: "",
    totalLandSize: "",
    status: "",
    youtubeUrl: "",
  });
  const [error, setError] = useState<ValidationError<PropertyPayload>>({});
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<FileType[]>([]);

  const onClose = () => {
    handleClose?.();
  };

  async function handleUpdateProperty() {
    setLoading(true);

    const payload = { ...formState };
    payload.propertyPic = files[0];
    payload.totalLandSize = parseInt(payload.totalLandSize.toString());

    const { error, result } = await updateProperty(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onUpdate?.(result);
      }
      setAlert({ message: "Property created", show: true, severity: "success" });
      onClose();
    }
    if (error.requestError) {
      setAlert({ message: error.requestError, show: true, severity: "error" });
      delete error.requestError;
    } else if (Object.keys(error).length) {
      setError(error);
      setAlert({ message: "Complete the required fields", show: true, severity: "error" });
    }
    setLoading(false);
  }

  function handleChange(field: keyof PropertyPayload, value: string) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof PropertyPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  useEffect(() => {
    async function populateFormState() {
      if (!property) return;
      setFormState({
        id: property?.id,
        propertyName: property?.propertyName || "",
        propertyPic: property?.propertyPic || "",
        totalLandSize: property?.totalLandSize || "",
        status: property?.status || "AVAILABLE",
        youtubeUrl: property?.youtubeUrl,
      });

      if (property?.propertyPic) {
        const response = await fetch(property.propertyPic);
        const blob = await response?.blob();

        const photo: FileType = new File([blob], `property_${property?.id}`, {
          type: blob.type,
          lastModified: Date.now(),
        });
        // Add custom properties to the file
        photo.preview = URL.createObjectURL(blob);

        setFiles([photo]);
      }
    }

    populateFormState();
  }, [property]);

  return (
    <Drawer isOpen={Boolean(property)} handleClose={onClose}>
      {showMarketValue ? (
        <AddMarketPrice property={property} handleClose={() => setShowMarketValue(false)} />
      ) : (
        <div className="mt-16 pb-8">
          <div className="mb-6">
            <Stack direction={"row"} justifyContent={"space-between"} spacing={"10px"} px="16px">
              <PageTitleBtn hideCancel>Update property </PageTitleBtn>
              <Tooltip title="Market value">
                <IconButton onClick={() => setShowMarketValue(true)} bg_color={COLORS.gray200}>
                  <CurrencyNgn weight="duotone" />
                </IconButton>
              </Tooltip>
            </Stack>

            <div className="flex flex-col mt-8 gap-4">
              <div className="flex flex-col gap-4  px-4">
                <MobileB1MGray900>PROPERTY DESCRIPTION</MobileB1MGray900>
                <Box>
                  <TextField
                    fullWidth
                    onChange={(e) => handleChange("propertyName", e.target.value)}
                    name="propertyName"
                    value={formState.propertyName}
                    label="Name"
                  />
                  {error?.propertyName?.map((error, i) => (
                    <Box key={i}>
                      <ErrorText>{error}</ErrorText>
                    </Box>
                  ))}
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    onChange={(e) => handleChange("totalLandSize", e.target.value)}
                    name="totalLandSize"
                    value={formState.totalLandSize}
                    label="Total Size"
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="start">SQM</InputAdornment>,
                      },
                    }}
                  />
                  {error?.totalLandSize?.map((error, i) => (
                    <Box key={i}>
                      <ErrorText>{error}</ErrorText>
                    </Box>
                  ))}
                </Box>
              </div>
              <Divider />

              <div className="flex flex-col gap-4 px-4">
                <MobileB1MGray900>PROPERTY STATUS</MobileB1MGray900>
                <Box>
                  <SelectWithStatus
                    label="Status"
                    value={formState.status}
                    items={[
                      { id: "AVAILABLE", label: "Available", status: "#28A745" },
                      { id: "SOLD_OUT", label: "Sold Out", status: SEVERITY_COLORS.danger.dark },
                      { id: "RESERVED", label: "Reserved", status: SEVERITY_COLORS.warning.dark },
                      { id: "DISABLED", label: "Archived", status: "darkgrey" },
                    ]}
                    onChange={(e) => handleChange("status", e.target.value as string)}
                  />
                  {error?.status?.map((error, i) => (
                    <Box key={i}>
                      <ErrorText>{error}</ErrorText>
                    </Box>
                  ))}
                </Box>
              </div>
              <Divider />

              <div className="flex flex-col gap-4 px-4">
                <MobileB1MGray900>PROPERTY BANNER</MobileB1MGray900>
                <Box>
                  <TextField
                    fullWidth
                    onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                    name="youtubeUrl"
                    value={formState.youtubeUrl}
                    label="Youtube link"
                  />
                  {error?.youtubeUrl?.map((error, i) => (
                    <Box key={i}>
                      <ErrorText>{error}</ErrorText>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <FileUpload
                    handleReset={() => handleReset("propertyPic")}
                    files={files}
                    setFiles={setFiles}
                    label="Add property banner"
                  />
                  {error?.propertyPic?.map((error, i) => (
                    <Box key={i}>
                      <ErrorText>{error}</ErrorText>
                    </Box>
                  ))}
                </Box>
              </div>
              <Divider />

              <div className="flex flex-col gap-4 px-4">
                <LoadingButton loadingPosition="end" loading={loading} onClick={handleUpdateProperty}>
                  Update Property
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export { CreatePropertyForm, UpdatePropertyForm };
